package com.example.examManagementBackend.paperWorkflows.repository;

import com.example.examManagementBackend.paperWorkflows.entity.Enums.PaperType;
import com.example.examManagementBackend.paperWorkflows.entity.ExaminationEntity;
import com.example.examManagementBackend.paperWorkflows.entity.CoursesEntity;
import com.example.examManagementBackend.paperWorkflows.entity.RoleAssignmentEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.RolesEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@EnableJpaRepositories
public interface RoleAssignmentRepository extends JpaRepository<RoleAssignmentEntity, Long> {

    // Check if a role assignment already exists for a given combination of course, role, and academic year
    boolean existsByCourseAndRoleAndExaminationIdAndPaperType(CoursesEntity course, RolesEntity role, ExaminationEntity academicYear, PaperType paperType);
    List<RoleAssignmentEntity> findByUserId_UserId(Long userId);
    List<RoleAssignmentEntity> findByExaminationId_Id(Long examinationId);
    // Check if a specific paper type (THEORY/PRACTICAL) is assigned to a course in an examination
    boolean existsByCourseIdAndExaminationIdAndPaperType(Long course_id, ExaminationEntity examinationId, PaperType paperType);
    List<RoleAssignmentEntity> findByCourseIdAndPaperType(Long courseId, PaperType paperType);

    boolean existsByUserId_UserIdAndRole_RoleIdAndIsAuthorizedTrue(Long userId, Long roleId);
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM RoleAssignmentEntity r WHERE r.userId.userId = :userid AND r.role.roleName = :name AND r.course.code = :code")
    boolean existedByUserId_RoleName_courseCode(@Param("userid") Long userId, @Param("name") String roleName, @Param("code") String courseCode);


    List<RoleAssignmentEntity> findByUserId_UserIdAndRole_RoleId(Long userId, Long roleId);

    @Query("SELECT ra FROM RoleAssignmentEntity ra " +
            "WHERE ra.userId.userId= :userId " +
            "AND ra.isAuthorized = true " +
            "AND (ra.examinationId.status = com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus.SCHEDULED " +
            "OR ra.examinationId.status = com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus.ONGOING)")
    List<RoleAssignmentEntity> findOngoingAndScheduledByUserId(@Param("userId") Long userId);

    Optional<RoleAssignmentEntity> findByUserIdAndCourseAndExaminationIdAndRoleAndPaperType(
            UserEntity user,
            CoursesEntity course,
            ExaminationEntity examination,
            RolesEntity role,
            PaperType paperType
    );

    @Query("SELECT r FROM RoleAssignmentEntity r WHERE r.examinationId.status = com.example.examManagementBackend.paperWorkflows.entity.Enums.ExamStatus.ONGOING" + " AND r.isAuthorized = true ")
    List<RoleAssignmentEntity> findAllByOngoingExaminations();

    @Query("SELECT DISTINCT r.examinationId.id FROM RoleAssignmentEntity r WHERE r.role.roleName = :roleName AND r.userId.userId = :userId")
    List<Long> getExamIdByRoleNameAndUserID(@Param("roleName") String roleName, @Param("userId") Long userId);

    @Query("SELECT r.paperType FROM RoleAssignmentEntity r WHERE r.course.code=:courseCode AND r.role.roleName = :roleName AND r.userId.userId = :userId AND r.examinationId.id=:examId")
    List<PaperType> getPaperTypeByCourseCode(@Param("courseCode") String courseCode, @Param("userId") Long userId, @Param("roleName") String roleName, @Param("examId") Long examId);






}

