package com.example.examManagementBackend.paperWorkflows.entity;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ExamStatusScheduler {

    private final ExaminationRepository examinationRepository;

    public ExamStatusScheduler(ExaminationRepository examinationRepository) {
        this.examinationRepository = examinationRepository;
    }

    @Scheduled(fixedRate = 60000) // Runs every minute
    public void updateExamStatuses() {
        List<ExaminationEntity> exams = examinationRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (ExaminationEntity exam : exams) {
            ExamStatus oldStatus = exam.getStatus();

            if (exam.getMarkingCompleteDate() != null && now.isAfter(exam.getMarkingCompleteDate())) {
                exam.setStatus(ExamStatus.COMPLETED);
            } else if (exam.getExamProcessStartDate() != null && now.isAfter(exam.getExamProcessStartDate())) {
                exam.setStatus(ExamStatus.ONGOING);
            } else {
                exam.setStatus(ExamStatus.SCHEDULED);
            }

            if (oldStatus != exam.getStatus()) {
                examinationRepository.save(exam);
            }
        }
    }
}
