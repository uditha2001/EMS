package com.example.examManagementBackend.configurations;

import com.example.examManagementBackend.userManagement.userManagementEntity.*;
import com.example.examManagementBackend.userManagement.userManagementRepo.*;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;


@Configuration
public class DatabaseSeeder {

    private final PermissionRepository permissionRepository;

    private final RoleRepository rolesRepository;

    private final UserManagementRepo userRepository;

    private final UserRolesRepository userRolesRepository;

    private final RolePermissionRepository rolePermissionRepository;

    private final PasswordEncoder passwordEncoder; // Properly inject PasswordEncoder

    public DatabaseSeeder(PermissionRepository permissionRepository, RoleRepository rolesRepository, UserManagementRepo userRepository, UserRolesRepository userRolesRepository, RolePermissionRepository rolePermissionRepository, PasswordEncoder passwordEncoder) {
        this.permissionRepository = permissionRepository;
        this.rolesRepository = rolesRepository;
        this.userRepository = userRepository;
        this.userRolesRepository = userRolesRepository;
        this.rolePermissionRepository = rolePermissionRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    @Transactional
    public void seedData() {
        try {
            // Seed permissions
            PermissionEntity p1 = createPermission("CREATE_USER", "Allows creating of new users", "User Management");
            PermissionEntity p2 = createPermission("UPDATE_USER", "Allows editing of user information", "User Management");
            PermissionEntity p3 = createPermission("DELETE_USER", "Allows deletion of user", "User Management");
            PermissionEntity p4 = createPermission("READ_USER", "Allows viewing of users", "User Management");
            PermissionEntity p5 = createPermission("CHANGE_USER_STATUS", "Allows changing of user status", "User Management");

            // Role Management Permissions
            PermissionEntity p6 = createPermission("CREATE_ROLE", "Allows creating new roles", "Role Management");
            PermissionEntity p7 = createPermission("UPDATE_ROLE", "Allows editing of role information", "Role Management");
            PermissionEntity p8 = createPermission("DELETE_ROLE", "Allows deletion of roles", "Role Management");
            PermissionEntity p9 = createPermission("READ_ROLE", "Allows viewing of roles", "Role Management");

            // Degree Program Permissions
            PermissionEntity p10 = createPermission("CREATE_DEGREE_PROGRAM", "Allows creating new degree programs", "Degree Program");
            PermissionEntity p11 = createPermission("UPDATE_DEGREE_PROGRAM", "Allows editing degree program information", "Degree Program");
            PermissionEntity p12 = createPermission("DELETE_DEGREE_PROGRAM", "Allows deletion of degree programs", "Degree Program");
            PermissionEntity p13 = createPermission("READ_DEGREE_PROGRAM", "Allows viewing of degree programs", "Degree Program");

            // Course Permissions
            PermissionEntity p14 = createPermission("CREATE_COURSE", "Allows creating new courses", "Courses");
            PermissionEntity p15 = createPermission("UPDATE_COURSE", "Allows editing of course details", "Courses");
            PermissionEntity p16 = createPermission("DELETE_COURSE", "Allows deletion of courses", "Courses");
            PermissionEntity p17 = createPermission("READ_COURSE", "Allows viewing of courses", "Courses");

            // Paper Permissions
            PermissionEntity p18 = createPermission("CREATE_PAPER", "Allows creating new exam papers", "Paper Workflow");
            PermissionEntity p19 = createPermission("MODERATE_PAPER", "Allows moderating exam papers", "Paper Workflow");
            PermissionEntity p20 = createPermission("ASSIGN_EXAM_ROLE", "Allows assigning exam roles to users", "Paper Workflow");
            PermissionEntity p21 = createPermission("TRANSFER_PAPER", "Allows transferring exam papers between departments", "Paper Workflow");
            PermissionEntity p22 = createPermission("EXAMINATION", "Allows Managing Examinations", "Paper Workflow");
            PermissionEntity p23 = createPermission("APPROVE_EXAM_ROLE", "Allows approving exam roles to users", "Paper Workflow");


            // Result Management Permissions
            PermissionEntity p24 = createPermission("ENTER_RESULTS", "Allows entering student exam results", "Result Management");
            PermissionEntity p25 = createPermission("MODERATE_RESULTS", "Allows moderating and verifying student results", "Result Management");
            PermissionEntity p26 = createPermission("APPROVE_RESULTS", "Allows approving final exam results", "Result Management");
            PermissionEntity p27 = createPermission("PUBLISH_RESULTS", "Allows publishing exam results", "Result Management");
            PermissionEntity p28 = createPermission("GENERATE_TRANSCRIPTS", "Allows generating student transcripts and result reports", "Result Management");
            PermissionEntity p29 = createPermission("MANAGE_REGRADES", "Allows handling regrading and appeal requests", "Result Management");

            PermissionEntity p30 = createPermission("HISTORICAL_DATA", "Allows viewing of past papers,results", "Historical Data");

            PermissionEntity p31 = createPermission("TIMETABLE", "Allows viewing of Time Table", "Scheduling");
            PermissionEntity p32 = createPermission("PAPER_EVALUATION", "Allows Add exam paper Evaluation", "Paper Workflow");
            PermissionEntity p33 = createPermission("EXAM_CENTERS", "Allows Manage of Exam Centers", "Scheduling");

            // Seed roles
            RolesEntity adminRole = createRole("ADMIN", "Administrator role(Head of the department)");
            RolesEntity paperCreatorRole = createRole("PAPER_CREATOR", "Role responsible for creating exam papers");
            RolesEntity paperModeratorRole = createRole("PAPER_MODERATOR", "Role responsible for moderating exam papers");
            RolesEntity firstMakerRole = createRole("FIRST_MAKER", "Role responsible for moderating and reviewing exam papers (First Maker)");
            RolesEntity secondMakerRole = createRole("SECOND_MAKER", "Role responsible for reviewing and finalizing exam papers (Second Maker)");
            RolesEntity academyCoordinatorRole = createRole("ACADEMY_COORDINATOR", "Role responsible for overseeing the academic aspects and coordination");



            // Assign permissions to roles
            assignPermissionToRole(p1, p2, p3, p4, p5, p6, p7, p8, adminRole);
            assignPermissionToRole(p9, p10, p11, p12, p13, p14, p15, p16, adminRole);
            assignPermissionToRole(p17, p18, p19, p20, p21, p22, p23, p24, adminRole);
            assignPermissionToRole(adminRole, p25);
            assignPermissionToRole(adminRole, p26);
            assignPermissionToRole(adminRole, p27);
            assignPermissionToRole(adminRole, p28);
            assignPermissionToRole(adminRole, p29);
            assignPermissionToRole(adminRole, p30);
            assignPermissionToRole(adminRole, p31);
            assignPermissionToRole(adminRole, p32);
            assignPermissionToRole(adminRole, p33);
            assignPermissionToRole(academyCoordinatorRole,p4);
            assignPermissionToRole(academyCoordinatorRole,p9);
            assignPermissionToRole(academyCoordinatorRole,p20);
            assignPermissionToRole(paperCreatorRole,p21);
            assignPermissionToRole(paperModeratorRole,p21);
            assignPermissionToRole(paperModeratorRole,p19);


            // Create admin user
            createUser("admin", "gimhanadeshan00@gmail.com", "pwd", adminRole);
            //createUser("coordinator", "coordinator@example.com", "pwd", academyCoordinatorRole);
        } catch (Exception e) {
            System.err.println("Error during database seeding: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void assignPermissionToRole(PermissionEntity p1, PermissionEntity p2, PermissionEntity p3, PermissionEntity p4, PermissionEntity p5, PermissionEntity p6, PermissionEntity p7, PermissionEntity p8, RolesEntity adminRole) {
        assignPermissionToRole(adminRole, p1);
        assignPermissionToRole(adminRole, p2);
        assignPermissionToRole(adminRole, p3);
        assignPermissionToRole(adminRole, p4);
        assignPermissionToRole(adminRole, p5);
        assignPermissionToRole(adminRole, p6);
        assignPermissionToRole(adminRole, p7);
        assignPermissionToRole(adminRole, p8);
    }

    private PermissionEntity createPermission(String name, String description, String type) {
        return permissionRepository.findByPermissionName(name)
                .orElseGet(() -> permissionRepository.save(new PermissionEntity(name, description, type)));
    }

    private RolesEntity createRole(String name, String description) {
        return rolesRepository.findByRoleName(name)
                .orElseGet(() -> {
                    RolesEntity newRole = new RolesEntity(name, description);
                    newRole.setProtected(true); // Set isSeeded flag to true for seeded roles
                    return rolesRepository.save(newRole);
                });
    }


    private void assignPermissionToRole(RolesEntity role, PermissionEntity permission) {
        if (!rolePermissionRepository.existsByRolesEntityAndPermissionEntity(role, permission)) {
            RolePermission rolePermission = new RolePermission(role, permission);
            rolePermissionRepository.save(rolePermission);
        }
    }

    private void createUser(String username, String email, String password, RolesEntity role) {
        // Check if user already exists
        if (userRepository.existsByUsername(username)) {
            System.out.println("User with username '" + username + "' already exists.");
            return;
        }

        // Encode password
        String encodedPassword = passwordEncoder.encode(password);

        // Create and save UserEntity using the provided constructor
        UserEntity user = new UserEntity(username, email, "Admin", "User", 0, true);
        user.setPassword(encodedPassword); // Set the encoded password

        UserEntity savedUser = userRepository.save(user);

        // Validate role and create UserRoles
        if (role == null) {
            throw new RuntimeException("Invalid role provided.");
        }

        UserRoles userRoles = new UserRoles();
        userRoles.setUser(savedUser);
        userRoles.setRole(role);
        userRolesRepository.save(userRoles);
    }
}
