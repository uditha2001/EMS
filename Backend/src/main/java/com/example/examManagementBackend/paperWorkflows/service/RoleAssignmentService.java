package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CreateRoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.dto.RoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;

import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RoleAssignmentService {

    @Autowired
    private RoleAssignmentRepository roleAssignmentRepository;

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private RoleRepository rolesRepository;

    @Autowired
    private UserManagementRepo userRepository;

    @Autowired
    private ExaminationRepository examinationRepository;

    public RoleAssignmentDTO assignRole(CreateRoleAssignmentDTO createRoleAssignmentDTO) {
        // Fetch required entities from the database
        CoursesEntity course = coursesRepository.findById(createRoleAssignmentDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + createRoleAssignmentDTO.getCourseId()));

        RolesEntity role = rolesRepository.findById(createRoleAssignmentDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + createRoleAssignmentDTO.getRoleId()));

        UserEntity user = userRepository.findById(createRoleAssignmentDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + createRoleAssignmentDTO.getUserId()));

        ExaminationEntity examination = examinationRepository.findById(createRoleAssignmentDTO.getExaminationId())
                .orElseThrow(() -> new RuntimeException("Examination not found with ID: " + createRoleAssignmentDTO.getExaminationId()));

        // Check for duplicates before inserting
        boolean exists = roleAssignmentRepository.existsByCourseAndRoleAndExaminationId(course, role, examination);
        if (exists) {
            throw new RuntimeException("Role assignment already exists for the specified course, role, and Examination.");
        }
        // Create and save role assignment
        RoleAssignmentEntity roleAssignment = new RoleAssignmentEntity();
        roleAssignment.setCourse(course);
        roleAssignment.setRole(role);
        roleAssignment.setUserId(user);
        roleAssignment.setExaminationId(examination);
        roleAssignment.setIsAuthorized(createRoleAssignmentDTO.getIsAuthorized());
        roleAssignment = roleAssignmentRepository.save(roleAssignment);

        // Convert to DTO for return
        return new RoleAssignmentDTO(
                roleAssignment.getId(),
                roleAssignment.getCourse().getId(),
                roleAssignment.getRole().getRoleId(),
                roleAssignment.getUserId().getUserId(),
                roleAssignment.getExaminationId().getId(),
                roleAssignment.getIsAuthorized()
        );
    }

    @Transactional
    public List<RoleAssignmentDTO> assignMultipleRoles(List<CreateRoleAssignmentDTO> createRoleAssignmentsDTOs) {
        List<RoleAssignmentDTO> result = new ArrayList<>();

        for (CreateRoleAssignmentDTO createRoleAssignmentDTO : createRoleAssignmentsDTOs) {
            // Fetch required entities from the database
            CoursesEntity course = coursesRepository.findById(createRoleAssignmentDTO.getCourseId())
                    .orElseThrow(() -> new RuntimeException("Course not found with ID: " + createRoleAssignmentDTO.getCourseId()));

            RolesEntity role = rolesRepository.findById(createRoleAssignmentDTO.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found with ID: " + createRoleAssignmentDTO.getRoleId()));

            UserEntity user = userRepository.findById(createRoleAssignmentDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found with ID: " + createRoleAssignmentDTO.getUserId()));

            ExaminationEntity examination = examinationRepository.findById(createRoleAssignmentDTO.getExaminationId())
                    .orElseThrow(() -> new RuntimeException("Examination not found with ID: " + createRoleAssignmentDTO.getExaminationId()));


            // Check for duplicates before inserting
            boolean exists = roleAssignmentRepository.existsByCourseAndRoleAndExaminationId(course, role, examination);
            if (exists) {
                throw new RuntimeException("Role assignment already exists for the specified course, role, and Examination.");
            }
            // Create and save role assignment
            RoleAssignmentEntity roleAssignment = new RoleAssignmentEntity();
            roleAssignment.setCourse(course);
            roleAssignment.setRole(role);
            roleAssignment.setUserId(user);
            roleAssignment.setExaminationId(examination);
            roleAssignment.setIsAuthorized(createRoleAssignmentDTO.getIsAuthorized());
            roleAssignment = roleAssignmentRepository.save(roleAssignment);

            // Convert to DTO for return
            RoleAssignmentDTO assignmentDTO = new RoleAssignmentDTO(
                    roleAssignment.getId(),
                    roleAssignment.getCourse().getId(),
                    roleAssignment.getRole().getRoleId(),
                    roleAssignment.getUserId().getUserId(),
                    roleAssignment.getExaminationId().getId(),
                    roleAssignment.getIsAuthorized()
            );

            result.add(assignmentDTO);
        }
        return result;
    }

}
