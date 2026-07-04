package com.careerpilot.service;

import com.careerpilot.model.ResumeAnalysis;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAnalysisService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public GeminiAnalysisService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public ResumeAnalysis analyzeResume(String extractedText) {
        String finalUrl = apiUrl + "?key=" + apiKey;

        String prompt = buildPrompt(extractedText);

        // Build Payload
        Map<String, Object> textPart = new HashMap<>();
        textPart.put("text", prompt);

        Map<String, Object> partContainer = new HashMap<>();
        partContainer.put("parts", List.of(textPart));

        Map<String, Object> payload = new HashMap<>();
        payload.put("contents", List.of(partContainer));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(payload, headers);

        try {
            // Invoke Gemini API
            Map<String, Object> rawResponse = restTemplate.postForObject(finalUrl, requestEntity, Map.class);
            
            if (rawResponse == null || !rawResponse.containsKey("candidates")) {
                throw new RuntimeException("Empty response from Gemini API");
            }

            // Extract the generated text from response candidate structure
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) rawResponse.get("candidates");
            if (candidates.isEmpty()) {
                throw new RuntimeException("No candidates returned from Gemini");
            }

            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts.isEmpty()) {
                throw new RuntimeException("No parts in Gemini content output");
            }

            String aiOutputText = (String) parts.get(0).get("text");
            
            // Clean up the output text (remove markdown json wrap if present)
            String cleanJson = sanitizeJsonOutput(aiOutputText);

            // Parse back into ResumeAnalysis entity
            ResumeAnalysis analysis = objectMapper.readValue(cleanJson, ResumeAnalysis.class);
            return analysis;

        } catch (Exception e) {
            throw new RuntimeException("Gemini Analysis failed: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(String resumeText) {
        return "You are an expert Applicant Tracking System (ATS), technical recruiter, and professional resume tuner.\n" +
               "Carefully read and analyze the extracted resume text below. Evaluate all skills, certifications, work details, and structure qualities.\n" +
               "Extracted Resume Text:\n" +
               "---------------------------\n" +
               resumeText + "\n" +
               "---------------------------\n" +
               "Return a strictly valid, parser-friendly JSON. Do not include markdown wraps like ```json or ```. Return only the JSON object.\n" +
               "Use the following JSON structural map:\n" +
               "{\n" +
               "  \"candidateInfo\": {\n" +
               "    \"name\": \"Full name found\",\n" +
               "    \"email\": \"Candidate email found\",\n" +
               "    \"phone\": \"Contact phone found\",\n" +
               "    \"education\": [\"List degree and locations\"],\n" +
               "    \"skills\": [\"Technical or soft skills found\"],\n" +
               "    \"projects\": [\"List projects described if any\"],\n" +
               "    \"experience\": [\"Positions and durations\"],\n" +
               "    \"certifications\": [\"Certifications or course completions\"]\n" +
               "  },\n" +
               "  \"resumeScore\": 75, // Score between 0 and 100\n" +
               "  \"strengths\": [\"Strength point 1\", \"Strength point 2\"],\n" +
               "  \"weaknesses\": [\"Weakness point 1\", \"Weakness point 2\"],\n" +
               "  \"missingSkills\": [\"Skill A\", \"Skill B\"],\n" +
               "  \"recommendedRoles\": [\"Role Title 1\", \"Role Title 2\"],\n" +
               "  \"atsSuggestions\": [\"ATS formatting or phrasing improvement point 1\", \"ATS improvement 2\"],\n" +
               "  \"learningRoadmap\": [\n" +
               "    {\n" +
               "      \"topic\": \"Topic or skill pathway element\",\n" +
               "      \"duration\": \"Duration to study\",\n" +
               "      \"resources\": \"Resource links or descriptions\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"interviewQuestions\": [\n" +
               "    {\n" +
               "      \"question\": \"Question based on their experience or skills\",\n" +
               "      \"answer\": \"Suggested expert candidate response mapping\"\n" +
               "    }\n" +
               "  ],\n" +
               "  \"careerAdvice\": \"General summary of where the candidate stands and how they can accelerate.\"\n" +
               "}\n";
    }

    private String sanitizeJsonOutput(String rawText) {
        String clean = rawText.trim();
        
        // Strip markdown markers if output by model
        if (clean.startsWith("```json")) {
            clean = clean.substring(7);
        } else if (clean.startsWith("```")) {
            clean = clean.substring(3);
        }
        
        if (clean.endsWith("```")) {
            clean = clean.substring(0, clean.length() - 3);
        }
        
        clean = clean.trim();
        
        // Parse bounding curly brackets
        int firstCurly = clean.indexOf('{');
        int lastCurly = clean.lastIndexOf('}');
        if (firstCurly != -1 && lastCurly != -1 && lastCurly > firstCurly) {
            clean = clean.substring(firstCurly, lastCurly + 1);
        }
        
        return clean;
    }
}
