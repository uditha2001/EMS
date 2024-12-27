package com.example.examManagementBackend.userManagement.userManagementRepo;

import com.example.examManagementBackend.userManagement.userManagementEntity.TokenEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@EnableJpaRepositories
public interface TokenRepo extends JpaRepository<TokenEntity, Long> {
    @Query("SELECT te FROM TokenEntity te WHERE te.user.userId = :userid")
    TokenEntity findToken(@Param("userid") Long userid);
    @Transactional
    @Modifying
    @Query("UPDATE TokenEntity te SET te.refreshToken = :newTokenValue WHERE te.token_id= :tokenId")
    void updaterefreshTokenValueById(@Param("tokenId") Long tokenId, @Param("newTokenValue") String newTokenValue);
    @Transactional
    @Modifying
    @Query("UPDATE TokenEntity te SET te.acessToken= :newTokenValue WHERE te.token_id= :tokenId")
    void updateacessTokenValueById(@Param("tokenId") Long tokenId, @Param("newTokenValue") String newTokenValue);
    TokenEntity findByAcessToken(String accessToken);
}
