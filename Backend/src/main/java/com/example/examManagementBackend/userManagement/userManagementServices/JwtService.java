package com.example.examManagementBackend.userManagement.userManagementServices;

import com.example.examManagementBackend.userManagement.userManagementDTO.LoginRequestDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.LoginResponseDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.RoleWithPermissionsDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import com.example.examManagementBackend.utill.JwtUtill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class JwtService implements UserDetailsService {

    @Autowired
    private UserManagementRepo userManagementRepo;
    @Autowired
    @Lazy
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtill jwtUtill;
    @Autowired
    RoleService roleService;
    @Autowired
    UserRolesRepository userRolesRepository;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserEntity userEntity=userManagementRepo.findByUsername(username);
        if(userEntity!=null){
            User user=new User(
                    userEntity.getUsername(),
                    userEntity.getPassword(),
                    getAuthority(userEntity)

            );
            return user;

        }
        else{
            throw new UsernameNotFoundException("User not found");
        }


    }
    //get authorities
    private Set<SimpleGrantedAuthority> getAuthority(UserEntity userEntity){
        Set<SimpleGrantedAuthority> authorities=new HashSet<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_"+getRolesByUserId(userEntity.getUsername())));
        return authorities;
    }

    public LoginResponseDTO CreateJwtToken(LoginRequestDTO loginRequestDTO){
        String username=loginRequestDTO.getUsername();
        String password=loginRequestDTO.getPassword();
        authenticate(username,password);
        UserDetails userDetails=loadUserByUsername(username);
        String newGeneratedToken  = jwtUtill.generateToken(userDetails);
        UserEntity userEntity=userManagementRepo.findByUsername(username);
        return new LoginResponseDTO(
                newGeneratedToken,
                userEntity

        );
    }
    private void authenticate(String username, String password){
        try{
                authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        }
        catch(BadCredentialsException e){
            System.out.println("unauthorized");
            throw new BadCredentialsException("Bad credentials",e);
        }
    }
    //get userroles using userid
    public List<RoleWithPermissionsDTO> getRolesByUserId(String user){
        UserEntity userEntities=userManagementRepo.findByUsername(user);
        Long currentUserId=userEntities.getUserId();
       List<UserRoles> roles=userRolesRepository.extractusers(currentUserId);
       RoleWithPermissionsDTO roleWithPermissionsDTO=new RoleWithPermissionsDTO(
               roles.
       )
        return null;
    }


}
