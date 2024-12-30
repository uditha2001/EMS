package com.example.examManagementBackend.userManagement.userManagementServices;
import com.example.examManagementBackend.userManagement.userManagementDTO.LoginRequestDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.LoginResponseDTO;
import com.example.examManagementBackend.userManagement.userManagementDTO.UserDTO;
import com.example.examManagementBackend.userManagement.userManagementEntity.TokenEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserEntity;
import com.example.examManagementBackend.userManagement.userManagementEntity.UserRoles;
import com.example.examManagementBackend.userManagement.userManagementRepo.TokenRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserManagementRepo;
import com.example.examManagementBackend.userManagement.userManagementRepo.UserRolesRepository;
import com.example.examManagementBackend.utill.JwtUtill;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
import java.io.IOException;
import java.util.ArrayList;
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
    @Autowired
    TokenRepo tokenRepo;
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
        List<String> roles=getRolesByUserId(userEntity.getUsername());
        if(roles!=null){

        }
        for(String role:roles){
            authorities.add(new SimpleGrantedAuthority("ROLE_"+getRolesByUserId(userEntity.getUsername())));
        }
        return authorities;
    }

    public LoginResponseDTO CreateJwtToken(LoginRequestDTO loginRequestDTO){
        String username=loginRequestDTO.getUsername();
        String password=loginRequestDTO.getPassword();
        authenticate(username,password);
        UserDetails userDetails=loadUserByUsername(username);
        String newGeneratedAccessToken  = jwtUtill.generateAccessToken(userDetails);
        String newGeneratedRefreshToken= jwtUtill.generateRefreshToken(userDetails);
        UserEntity userEntity=userManagementRepo.findByUsername(username);
        TokenEntity token =null;
        if(tokenRepo.findToken(userEntity.getUserId())!=null){
            token=tokenRepo.findToken(userEntity.getUserId());
            String oldToken=token.getRefreshToken();
            tokenRepo.updaterefreshTokenValueById(token.getToken_id(), newGeneratedRefreshToken);
            tokenRepo.updateacessTokenValueById(token.getToken_id(), newGeneratedAccessToken);
        }
        else{
            token=new TokenEntity(

            );
            token.setRefreshToken(newGeneratedRefreshToken);
            token.setAcessToken(newGeneratedAccessToken);
            token.setUser(userEntity);
            tokenRepo.save(token);
        }
        UserDTO userDTO=new UserDTO(
                userEntity.getUserId(),
                userEntity.getUsername(),
                userEntity.getEmail(),
                userEntity.getFirstName(),
                userEntity.getLastName(),
                getRolesByUserId(userEntity.getUsername()),
                userEntity.isActive()
        );
        return new LoginResponseDTO(
                newGeneratedAccessToken,
                userDTO

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
    public List<String> getRolesByUserId(String user){
        UserEntity userEntities=userManagementRepo.findByUsername(user);
        Long currentUserId=userEntities.getUserId();
        List<String> rolesSet=new ArrayList<>();
       List<UserRoles> roles=userRolesRepository.extractusers(currentUserId);
       for(UserRoles userrole:roles){
                rolesSet.add(userrole.getRole().getRoleName());
        }
     if(rolesSet.size()>0){
         UserDTO userdto=new UserDTO(
                 rolesSet
         );
         return userdto.getRoles();
     }
     else{
         rolesSet.add("ADMIN");
         return rolesSet;
     }

    }

    //refresh the acess token using refresh token
    public LoginResponseDTO refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        final String authorizationHeader = request.getHeader("Authorization");
        String acesssToken=null;
        String userName=null;
        String refreshToken=null;
        TokenEntity token=null;
        LoginResponseDTO loginResponseDTO=null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            acesssToken= authorizationHeader.substring(7);
            token=tokenRepo.findByAcessToken(acesssToken);
            refreshToken=token.getRefreshToken();
            userName=jwtUtill.extractUserName(refreshToken);
        }
        if(userName!=null){
            UserDetails userDetails=loadUserByUsername(userName);
            UserEntity userEntity=userManagementRepo.findByUsername(userName);
            UserDTO userDTO=new UserDTO(
                    userEntity.getUserId(),
                    userEntity.getUsername(),
                    userEntity.getEmail(),
                    userEntity.getFirstName(),
                    userEntity.getLastName(),
                    getRolesByUserId(userEntity.getUsername()),
                    userEntity.isActive()
            );
            if(jwtUtill.validateToken(refreshToken,userDetails)){
                    String acessToken= jwtUtill.generateAccessToken(userDetails);
                    tokenRepo.updateacessTokenValueById(token.getToken_id(),acessToken);
                    loginResponseDTO=new LoginResponseDTO(
                            acessToken,
                            userDTO

                    );
                    new ObjectMapper().writeValue(response.getOutputStream(),loginResponseDTO);
            }
        }

        return loginResponseDTO;
    }

    public String cleanTokens(HttpServletRequest request){
        final String authorizationHeader = request.getHeader("Authorization");
        String acesssToken=null;
        TokenEntity token=new TokenEntity();
        if(authorizationHeader.startsWith("Bearer ")){
            acesssToken= authorizationHeader.substring(7);
            System.out.println(acesssToken);
            token.setAcessToken(acesssToken);
            tokenRepo.deletebyAcessToken(token.getAcessToken());
            return "ok";
        }
        return "failed";
    }
}
