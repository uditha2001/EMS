package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.CreateRoleAssignmentDTO;
import com.example.examManagementBackend.paperWorkflows.dto.GetModeratorDTO;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleAssignmentService {

    private final RoleAssignmentRepository roleAssignmentRepository;
    private final CoursesRepository coursesRepository;
    private final RoleRepository rolesRepository;
    private final UserManagementRepo userRepository;
    private final ExaminationRepository examinationRepository;
    private final UserRolesRepository userRolesRepo;

    public RoleAssignmentService(RoleAssignmentRepository roleAssignmentRepository,CoursesRepository coursesRepository,RoleRepository roleRepository,UserManagementRepo userManagementRepo,ExaminationRepository examinationRepository,UserRolesRepository userRolesRepository)
    {
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.coursesRepository = coursesRepository;
        this.rolesRepository = roleRepository;
        this.userRepository = userManagementRepo;
        this.examinationRepository = examinationRepository;
        this.userRolesRepo = userRolesRepository;
    }

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
    public String editRoleAssignment(Long id, Long userId) {
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));

        roleAssignment.setUserId(userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId)));

        roleAssignmentRepository.save(roleAssignment);

        return "User updated successfully in role assignment";
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
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Check if the role is authorized before assigning it to the user
        if (!roleAssignmentRepository.existsByUserId_UserIdAndRole_RoleIdAndIsAuthorizedTrue(userId, roleId)) {
            throw new RuntimeException("Role is not authorized for this user.");
        }

        // Fetch all role assignments
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByUserId_UserIdAndRole_RoleId(userId, roleId);

        if (roleAssignments.isEmpty()) {
            throw new RuntimeException("Role assignment not found for the user and role.");
        }

        // Assume we pick the first assignment if there are multiple
        RoleAssignmentEntity roleAssignment = roleAssignments.get(0);
        ExaminationEntity examination = roleAssignment.getExaminationId();

        // Determine the grantAt date based on the role
        LocalDateTime grantAtDate = null;
        if (roleId == 2 || roleId == 3) { // Paper creator/modifier roles
            grantAtDate = examination.getPaperSettingCompleteDate();
        } else if (roleId == 4 || roleId == 5) { // First and second marker roles
            grantAtDate = examination.getMarkingCompleteDate();
        }

        // Check if the user already has this role
        Optional<UserRoles> existingUserRoleOpt = userRolesRepo.findByUser_UserIdAndRole_RoleId(userId, roleId);

        if (existingUserRoleOpt.isPresent()) {
            // Update the grantAt date if the new date is more recent
            UserRoles existingUserRole = existingUserRoleOpt.get();
            if (grantAtDate != null && (existingUserRole.getGrantAt() == null || grantAtDate.isAfter(existingUserRole.getGrantAt()))) {
                existingUserRole.setGrantAt(grantAtDate);
                userRolesRepo.save(existingUserRole);
            }
        } else {
            // Assign the role to the user with the grantAt date
            UserRoles userRole = new UserRoles();
            userRole.setUser(user);
            userRole.setRole(role);
            userRole.setGrantAt(grantAtDate);
            userRolesRepo.save(userRole);
        }
    }

    public List<GetModeratorDTO> getPaperModeratorsByCourseAndPaperType(Long courseId, PaperType paperType) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByCourseIdAndPaperType(courseId, paperType);

        return roleAssignments.stream()
                .filter(roleAssignment -> roleAssignment.getRole().getRoleId() == 3) // Role ID for Paper Moderator
                .map(roleAssignment -> new GetModeratorDTO(
                        roleAssignment.getUserId().getUserId(),
                        roleAssignment.getUserId().getFirstName() + " " + roleAssignment.getUserId().getLastName()
                ))
                .collect(Collectors.toList());
    }



}