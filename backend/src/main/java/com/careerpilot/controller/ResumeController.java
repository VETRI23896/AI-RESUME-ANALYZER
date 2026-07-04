package com.careerpilot.controller;

import com.careerpilot.model.ResumeAnalysis;
import com.careerpilot.model.User;
import com.careerpilot.repository.ResumeAnalysisRepository;
import com.careerpilot.service.AuthService;
import com.careerpilot.service.GeminiAnalysisService;
import com.careerpilot.service.PdfExtractionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final PdfExtractionService pdfExtractionService;
    private final GeminiAnalysisService geminiAnalysisService;
    private final ResumeAnalysisRepository resumeAnalysisRepository;
    private final AuthService authService;

    public ResumeController(PdfExtractionService pdfExtractionService,
                            GeminiAnalysisService geminiAnalysisService,
                            ResumeAnalysisRepository resumeAnalysisRepository,
                            AuthService authService) {
        this.pdfExtractionService = pdfExtractionService;
        this.geminiAnalysisService = geminiAnalysisService;
        this.resumeAnalysisRepository = resumeAnalysisRepository;
        this.authService = authService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadAndAnalyzeResume(@RequestParam("resume") MultipartFile file) {
        try {
            // Get authenticated user ID from context email
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = authService.getUserByEmail(email);

            // Extract Text
            String extractedText;
            try {
                extractedText = pdfExtractionService.extractText(file);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        .body(Map.of("error", "Failed to extract text from PDF: " + e.getMessage()));
            }

            // Run Gemini AI Analysis
            ResumeAnalysis analysis;
            try {
                analysis = geminiAnalysisService.analyzeResume(extractedText);
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "AI Analysis failed: " + e.getMessage() + ". Please retry."));
            }

            // Set Metadata
            analysis.setUserId(user.getId());
            analysis.setUploadedFileName(file.getOriginalFilename());
            analysis.setUploadedAt(LocalDateTime.now());
            analysis.setExtractedText(extractedText);

            // Save to DB
            ResumeAnalysis savedAnalysis = resumeAnalysisRepository.save(analysis);

            return ResponseEntity.ok(savedAnalysis);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Server error during upload: " + e.getMessage()));
        }
    }

    @GetMapping("/history")
    public ResponseEntity<?> getHistory() {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = authService.getUserByEmail(email);

            List<ResumeAnalysis> history = resumeAnalysisRepository.findByUserIdOrderByUploadedAtDesc(user.getId());
            
            // Clean/Transform history objects to reduce bandwidth (removes large extracted text elements for grid page)
            List<?> responseHistory = history.stream().map(h -> Map.of(
                    "id", h.getId(),
                    "fileName", h.getUploadedFileName(),
                    "uploadedAt", h.getUploadedAt(),
                    "score", h.getResumeScore(),
                    "candidateName", h.getCandidateInfo() != null ? h.getCandidateInfo().getName() : "Candidate"
            )).toList();

            return ResponseEntity.ok(responseHistory);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch history: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAnalysisDetails(@PathVariable("id") String id) {
        try {
            String email = SecurityContextHolder.getContext().getAuthentication().getName();
            User user = authService.getUserByEmail(email);

            ResumeAnalysis analysis = resumeAnalysisRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Analysis not found!"));

            // Validate that this analysis belongs to the requested user
            if (!analysis.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "Access denied to requested analysis"));
            }

            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
