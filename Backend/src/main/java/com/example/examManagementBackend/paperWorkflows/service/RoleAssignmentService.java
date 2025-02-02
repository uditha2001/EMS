package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CreateRoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.dto.RoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;

import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

    @Autowired
    private UserManagementRepo userManagementRepo;
    @Autowired
    private UserRolesRepository userRolesRepo;
    @Autowired
    private RoleRepository roleRepository;

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
        boolean exists = roleAssignmentRepository.existsByCourseAndRoleAndExaminationIdAndPaperType(course, role, examination, createRoleAssignmentDTO.getPaperType());
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
        roleAssignment.setPaperType(createRoleAssignmentDTO.getPaperType());
        roleAssignment = roleAssignmentRepository.save(roleAssignment);

        // Convert to DTO for return
        return new RoleAssignmentDTO(
                roleAssignment.getId(),
                roleAssignment.getCourse().getId(),
                roleAssignment.getCourse().getCode(),
                roleAssignment.getCourse().getName(),
                roleAssignment.getRole().getRoleId(),
                roleAssignment.getRole().getRoleName(),
                roleAssignment.getUserId().getUserId(),
                roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName(),
                roleAssignment.getExaminationId().getId(),
                roleAssignment.getIsAuthorized(),
                roleAssignment.getPaperType()
        );
    }

    public String authorizeRole(Long id) {
        // Fetch the role assignment by ID
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));

        // Mark the role assignment as authorized
        roleAssignment.setIsAuthorized(true);

        // Save the updated role assignment
        RoleAssignmentEntity updatedRole = roleAssignmentRepository.save(roleAssignment);

        // Assign the role to the user after authorization
        assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId());

        return "Role authorized and assigned successfully";
    }


    public void unassignRole(Long id) {
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));

        roleAssignmentRepository.delete(roleAssignment);
    }

    public List<RoleAssignmentDTO> getAllRoleAssignments() {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findAll();
        List<RoleAssignmentDTO> result = new ArrayList<>();

        for (RoleAssignmentEntity roleAssignment : roleAssignments) {
            result.add(new RoleAssignmentDTO(
                    roleAssignment.getId(),
                    roleAssignment.getCourse().getId(),
                    roleAssignment.getCourse().getCode(),
                    roleAssignment.getCourse().getName(),
                    roleAssignment.getRole().getRoleId(),
                    roleAssignment.getRole().getRoleName(),
                    roleAssignment.getUserId().getUserId(),
                    roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName(),
                    roleAssignment.getExaminationId().getId(),
                    roleAssignment.getIsAuthorized(),
                    roleAssignment.getPaperType()
            ));
        }

        return result;
    }

    public List<RoleAssignmentDTO> getRoleAssignmentsByUser(Long userId) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByUserId_UserId(userId);
        List<RoleAssignmentDTO> result = new ArrayList<>();

        for (RoleAssignmentEntity roleAssignment : roleAssignments) {
            result.add(new RoleAssignmentDTO(
                    roleAssignment.getId(),
                    roleAssignment.getCourse().getId(),
                    roleAssignment.getCourse().getCode(),
                    roleAssignment.getCourse().getName(),
                    roleAssignment.getRole().getRoleId(),
                    roleAssignment.getRole().getRoleName(),
                    roleAssignment.getUserId().getUserId(),
                    roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName(),
                    roleAssignment.getExaminationId().getId(),
                    roleAssignment.getIsAuthorized(),
                    roleAssignment.getPaperType()
            ));
        }

        return result;
    }

    public List<RoleAssignmentDTO> getRoleAssignmentsByExamination(Long examinationId) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByExaminationId_Id(examinationId);
        List<RoleAssignmentDTO> result = new ArrayList<>();

        for (RoleAssignmentEntity roleAssignment : roleAssignments) {
            result.add(new RoleAssignmentDTO(
                    roleAssignment.getId(),
                    roleAssignment.getCourse().getId(),
                    roleAssignment.getCourse().getCode(),
                    roleAssignment.getCourse().getName(),
                    roleAssignment.getRole().getRoleId(),
                    roleAssignment.getRole().getRoleName(),
                    roleAssignment.getUserId().getUserId(),
                    roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName(),
                    roleAssignment.getExaminationId().getId(),
                    roleAssignment.getIsAuthorized(),
                    roleAssignment.getPaperType()
            ));
        }

        return result;
    }

    // Edit a role assignment
    public String editRoleAssignment(Long id, CreateRoleAssignmentDTO createRoleAssignmentDTO) {
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));

        // Update the role assignment with the new details
        roleAssignment.setCourse(coursesRepository.findById(createRoleAssignmentDTO.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + createRoleAssignmentDTO.getCourseId())));
        roleAssignment.setRole(rolesRepository.findById(createRoleAssignmentDTO.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found with ID: " + createRoleAssignmentDTO.getRoleId())));
        roleAssignment.setUserId(userRepository.findById(createRoleAssignmentDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + createRoleAssignmentDTO.getUserId())));
        roleAssignment.setExaminationId(examinationRepository.findById(createRoleAssignmentDTO.getExaminationId())
                .orElseThrow(() -> new RuntimeException("Examination not found with ID: " + createRoleAssignmentDTO.getExaminationId())));
        roleAssignment.setPaperType(createRoleAssignmentDTO.getPaperType());  // Make sure to set paperType as enum

        roleAssignmentRepository.save(roleAssignment);

        return "Role assignment updated successfully";
    }

    // Authorize roles for a given examination
    public String authorizeRolesByExamination(Long examinationId) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByExaminationId_Id(examinationId);
        if (roleAssignments.isEmpty()) {
            return "No role assignments found for this examination.";
        }

        for (RoleAssignmentEntity roleAssignment : roleAssignments) {
            roleAssignment.setIsAuthorized(true);  // Mark as authorized
            roleAssignmentRepository.save(roleAssignment);

            // After authorization, assign the role to the user
            assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId());
        }

        return "Roles authorized and assigned successfully for the examination";
    }


    // Authorize roles for a given course and paper type
    public String authorizeRolesByCourseAndPaperType(Long courseId, PaperType paperType) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByCourseIdAndPaperType(courseId, paperType);
        if (roleAssignments.isEmpty()) {
            return "No role assignments found for this course and paper type.";
        }

        for (RoleAssignmentEntity roleAssignment : roleAssignments) {
            roleAssignment.setIsAuthorized(true);  // Mark as authorized
            roleAssignmentRepository.save(roleAssignment);

            // After authorization, assign the role to the user
            assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId());
        }

        return "Roles authorized and assigned successfully for the course and paper type";
    }


    public RoleAssignmentDTO getRoleAssignmentById(Long id) {
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));
        return new RoleAssignmentDTO(
                roleAssignment.getId(),
                roleAssignment.getCourse().getId(),
                roleAssignment.getCourse().getCode(),
                roleAssignment.getCourse().getName(),
                roleAssignment.getRole().getRoleId(),
                roleAssignment.getRole().getRoleName(),
                roleAssignment.getUserId().getUserId(),
                roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName(),
                roleAssignment.getExaminationId().getId(),
                roleAssignment.getIsAuthorized(),
                roleAssignment.getPaperType()
        );
    }

    @Transactional
    public void assignRoleToUser(Long userId, Long roleId) {
        UserEntity user = userManagementRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        RolesEntity role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Check if the role is authorized before assigning it to the user
        if (!roleAssignmentRepository.existsByUserId_UserIdAndRole_RoleIdAndIsAuthorizedTrue(userId, roleId)) {
            throw new RuntimeException("Role is not authorized for this user.");
        }

        // If the user already has this role, avoid assigning again
        if (!userRolesRepo.existsByUser_UserIdAndRole_RoleId(userId, roleId)) {
            UserRoles userRole = new UserRoles();
            userRole.setUser(user);
            userRole.setRole(role);
            userRolesRepo.save(userRole);
        }
    }


}