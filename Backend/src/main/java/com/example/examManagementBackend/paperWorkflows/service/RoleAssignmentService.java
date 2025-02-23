package com.example.examManagementBackend.paperWorkflows.service;

import com.example.examManagementBackend.paperWorkflows.dto.*;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentRevisionEntity;
import com.example.examManagementBackend.paperWorkflows.repository.CoursesRepository;
import com.example.examManagementBackend.paperWorkflows.repository.ExaminationRepository;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRepository;
import com.example.examManagementBackend.paperWorkflows.repository.RoleAssignmentRevisionRepository;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.RoleRepository;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
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

    private final RoleAssignmentRevisionRepository roleAssignmentRevisionRepository;

    public RoleAssignmentService(RoleAssignmentRepository roleAssignmentRepository, CoursesRepository coursesRepository, RoleRepository roleRepository, UserManagementRepo userManagementRepo, ExaminationRepository examinationRepository, UserRolesRepository userRolesRepository, RoleAssignmentRevisionRepository roleAssignmentRevisionRepository)
    {
        this.roleAssignmentRepository = roleAssignmentRepository;
        this.coursesRepository = coursesRepository;
        this.rolesRepository = roleRepository;
        this.userRepository = userManagementRepo;
        this.examinationRepository = examinationRepository;
        this.userRolesRepo = userRolesRepository;
        this.roleAssignmentRevisionRepository = roleAssignmentRevisionRepository;
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

        // Determine the grantAt date based on the role
        LocalDateTime grantAtDate = null;
        if (role.getRoleId() == 2 || role.getRoleId() == 3) { // Paper creator/modifier roles
            grantAtDate = examination.getPaperSettingCompleteDate();
        } else if (role.getRoleId() == 4 || role.getRoleId() == 5) { // First and second marker roles
            grantAtDate = examination.getMarkingCompleteDate();
        }

        roleAssignment.setCourse(course);
        roleAssignment.setRole(role);
        roleAssignment.setUserId(user);
        roleAssignment.setExaminationId(examination);
        roleAssignment.setIsAuthorized(createRoleAssignmentDTO.getIsAuthorized());
        roleAssignment.setPaperType(createRoleAssignmentDTO.getPaperType());
        roleAssignment.setGrantAt(grantAtDate);
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
        roleAssignmentRepository.save(roleAssignment);

        // Assign the role to the user after authorization
        assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId(),roleAssignment.getGrantAt());

        return "Role authorized and assigned successfully";
    }


    public void unassignRole(Long id) {
        RoleAssignmentEntity roleAssignment = roleAssignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role assignment not found with ID: " + id));

        roleAssignmentRepository.delete(roleAssignment);
    }

    public List<RoleAssignmentDTO> getAllRoleAssignments() {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findAll();
        return getRoleAssignmentDTOS(roleAssignments);
    }

    public List<RoleAssignmentDTO> getRoleAssignmentsByUser(Long userId) {
        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByUserId_UserId(userId);
        return getRoleAssignmentDTOS(roleAssignments);
    }

    private List<RoleAssignmentDTO> getRoleAssignmentDTOS(List<RoleAssignmentEntity> roleAssignments) {
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
        return getRoleAssignmentDTOS(roleAssignments);
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
            assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId(),roleAssignment.getGrantAt());
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
            assignRoleToUser(roleAssignment.getUserId().getUserId(), roleAssignment.getRole().getRoleId(),roleAssignment.getGrantAt());
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
    public void assignRoleToUser(Long userId, Long roleId,LocalDateTime grantAtDate ) {
        UserEntity user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        RolesEntity role = rolesRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found"));

        // Check if the role is authorized for the user
        if (!roleAssignmentRepository.existsByUserId_UserIdAndRole_RoleIdAndIsAuthorizedTrue(userId, roleId)) {
            throw new IllegalStateException("Role is not authorized for this user.");
        }

//        // Fetch role assignments
//        List<RoleAssignmentEntity> roleAssignments = roleAssignmentRepository.findByUserId_UserIdAndRole_RoleId(userId, roleId);
//        if (roleAssignments.isEmpty()) {
//            throw new IllegalStateException("Role assignment not found for the user and role.");
//        }
//
//        // Get the first available assignment
//        RoleAssignmentEntity roleAssignment = roleAssignments.get(0);
//        ExaminationEntity examination = roleAssignment.getExaminationId();
//
//        // Determine grantAt date based on role
//        LocalDateTime grantAtDate = null;
//        if (Objects.equals(roleId, 2L) || Objects.equals(roleId, 3L)) { // Paper creator/modifier roles
//            grantAtDate = examination.getPaperSettingCompleteDate();
//        } else if (Objects.equals(roleId, 4L) || Objects.equals(roleId, 5L)) { // First and second marker roles
//            grantAtDate = examination.getMarkingCompleteDate();
//        }

        // Check if the user already has this role
        Optional<UserRoles> existingUserRoleOpt = userRolesRepo.findByUser_UserIdAndRole_RoleId(userId, roleId);

        if (existingUserRoleOpt.isPresent()) {
            UserRoles existingUserRole = existingUserRoleOpt.get();
            LocalDateTime existingGrantAt = existingUserRole.getGrantAt();

            // ✅ Update grantAt only if the new date is later than the existing one
            if (grantAtDate != null && (existingGrantAt == null || grantAtDate.isAfter(existingGrantAt))) {
                existingUserRole.setGrantAt(grantAtDate);
                userRolesRepo.save(existingUserRole);
            }
        } else {
            // Assign the role to the user with grantAt date
            UserRoles userRole = new UserRoles();
            userRole.setUser(user);
            userRole.setRole(role);
            userRole.setGrantAt(grantAtDate);
            userRolesRepo.save(userRole);
        }
    }


    @Transactional
    public void unAssignRoleFromUser(Long userId, Long roleId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        rolesRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));

        // Find the user's role assignment
        Optional<UserRoles> userRoleOpt = userRolesRepo.findByUser_UserIdAndRole_RoleId(userId, roleId);

        if (userRoleOpt.isEmpty()) {
            throw new RuntimeException("User does not have the assigned role.");
        }

        // Delete the role assignment
        userRolesRepo.delete(userRoleOpt.get());

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

    public List<RoleAssignmentRevisionResponseDTO> changeAssignedUsers(List<RoleAssignmentRevisionRequestDTO> requestDTOList) {
        return requestDTOList.stream()
                .map(this::processUserChange)
                .collect(Collectors.toList());
    }
  @Transactional
  protected RoleAssignmentRevisionResponseDTO processUserChange(RoleAssignmentRevisionRequestDTO requestDTO) {
        Optional<RoleAssignmentEntity> roleAssignmentOptional = roleAssignmentRepository.findById(requestDTO.getRoleAssignmentId());
        Optional<UserEntity> newUserOptional = userRepository.findById(requestDTO.getNewUserId());
        Optional<UserEntity> revisedByOptional = userRepository.findById(requestDTO.getRevisedById());

        if (roleAssignmentOptional.isPresent() && newUserOptional.isPresent() && revisedByOptional.isPresent()) {
            RoleAssignmentEntity roleAssignment = roleAssignmentOptional.get();
            UserEntity previousUser = roleAssignment.getUserId();
            UserEntity newUser = newUserOptional.get();
            UserEntity revisedBy = revisedByOptional.get();

            // Update the role assignment with the new user
            roleAssignment.setUserId(newUser);
            roleAssignmentRepository.save(roleAssignment);

            // Create a revision record
            RoleAssignmentRevisionEntity revision = new RoleAssignmentRevisionEntity();
            revision.setRoleAssignment(roleAssignment);
            revision.setPreviousUser(previousUser);
            revision.setNewUser(newUser);
            revision.setRevisionReason(requestDTO.getRevisionReason());
            revision.setRevisedBy(revisedBy);
            revision.setRevisedAt(LocalDateTime.now());

            // Save revision history
            RoleAssignmentRevisionEntity savedRevision = roleAssignmentRevisionRepository.save(revision);

            unAssignRoleFromUser(revision.getPreviousUser().getUserId(),revision.getRoleAssignment().getRole().getRoleId());

            assignRoleToUser(revision.getNewUser().getUserId(),revision.getRoleAssignment().getRole().getRoleId(),roleAssignment.getGrantAt());

            // Convert to DTO for response
            RoleAssignmentRevisionResponseDTO responseDTO = new RoleAssignmentRevisionResponseDTO();
            responseDTO.setRoleAssignmentId(roleAssignment.getId());
            responseDTO.setPreviousUserId(previousUser.getUserId());
            responseDTO.setNewUserId(newUser.getUserId());
            responseDTO.setRevisionReason(savedRevision.getRevisionReason());
            responseDTO.setRevisedById(revisedBy.getUserId());
            responseDTO.setRevisedAt(savedRevision.getRevisedAt());

            return responseDTO;
        } else {
            throw new RuntimeException("Role Assignment, New User, or Revised By User not found");
        }
    }

    public List<RoleAssignmentRevisionDTO> getRevisionsByExamination(Long examinationId) {
        List<RoleAssignmentRevisionEntity> revisions = roleAssignmentRevisionRepository.findByRoleAssignment_ExaminationId_Id(examinationId);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        return revisions.stream().map(revision -> new RoleAssignmentRevisionDTO(
                revision.getRoleAssignment().getId(),
                revision.getRoleAssignment().getCourse().getId(),
                revision.getRoleAssignment().getCourse().getCode(),
                revision.getRoleAssignment().getCourse().getName(),
                revision.getRoleAssignment().getPaperType().toString(),
                revision.getRoleAssignment().getRole().getRoleName(),
                revision.getPreviousUser().getFirstName()+" "+revision.getPreviousUser().getLastName(),
                revision.getNewUser().getFirstName()+" "+revision.getNewUser().getLastName(),
                revision.getRevisionReason(),
                revision.getRevisedBy().getFirstName()+" "+revision.getRevisedBy().getLastName(),
                revision.getRevisedAt().format(formatter)
        )).collect(Collectors.toList());
    }

}