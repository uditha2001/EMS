package com.example.examManagementBackend.paperWorkflows.specifications;

import com.example.examManagementBackend.paperWorkflows.entity.ArchivedPaper;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ArchivedPaperSpecification {

    public static Specification<ArchivedPaper> filterByCriteria(
            String fileName, String creatorName, String moderatorName,
            String courseCode, String paperType, String degreeName,
            String year, String level, String semester,
            LocalDateTime startDate, LocalDateTime endDate) {

        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Join related tables
            Join<Object, Object> creatorJoin = root.join("creator");
            Join<Object, Object> moderatorJoin = root.join("moderator");
            Join<Object, Object> courseJoin = root.join("course");
            Join<Object, Object> examJoin = root.join("examination");
            Join<Object, Object> degreeJoin = examJoin.join("degreeProgramsEntity");

            if (fileName != null && !fileName.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(root.get("fileName")), "%" + fileName.toLowerCase() + "%"));
            }
            if (creatorName != null && !creatorName.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(creatorJoin.get("username")), "%" + creatorName.toLowerCase() + "%"));
            }
            if (moderatorName != null && !moderatorName.isEmpty()) {
                predicates.add(criteriaBuilder.like(criteriaBuilder.lower(moderatorJoin.get("username")), "%" + moderatorName.toLowerCase() + "%"));
            }
            if (courseCode != null && !courseCode.isEmpty()) {
                predicates.add(criteriaBuilder.equal(courseJoin.get("code"), courseCode));
            }
            if (paperType != null && !paperType.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("paperType"), paperType));
            }
            if (degreeName != null && !degreeName.isEmpty()) {
                predicates.add(criteriaBuilder.equal(degreeJoin.get("degreeName"), degreeName));
            }
            if (year != null && !year.isEmpty()) {
                predicates.add(criteriaBuilder.equal(examJoin.get("year"), year));
            }
            if (level != null && !level.isEmpty()) {
                predicates.add(criteriaBuilder.equal(examJoin.get("level"), level));
            }
            if (semester != null && !semester.isEmpty()) {
                predicates.add(criteriaBuilder.equal(examJoin.get("semester"), semester));
            }
            if (startDate != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("sharedAt"), startDate));
            }
            if (endDate != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("sharedAt"), endDate));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
