package com.careerpilot.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "resume_analyses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ResumeAnalysis {
    @Id
    private String id;
    private String userId;
    private String uploadedFileName;
    private LocalDateTime uploadedAt = LocalDateTime.now();
    private String extractedText;
    
    private CandidateInfo candidateInfo;
    private int resumeScore;
    private List<String> strengths;
    private List<String> weaknesses;
    private List<String> missingSkills;
    private List<String> recommendedRoles;
    private List<String> atsSuggestions;
    private List<RoadmapItem> learningRoadmap;
    private List<InterviewQuestion> interviewQuestions;
    private String careerAdvice;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CandidateInfo {
        private String name;
        private String email;
        private String phone;
        private List<String> education;
        private List<String> skills;
        private List<String> projects;
        private List<String> experience;
        private List<String> certifications;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RoadmapItem {
        private String topic;
        private String duration;
        private String resources;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewQuestion {
        private String question;
        private String answer;
    }
}
