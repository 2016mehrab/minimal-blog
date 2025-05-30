package com.samurai74.minimalblog.repositories;

import com.samurai74.minimalblog.domain.entities.RefreshToken;
import com.samurai74.minimalblog.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByUser(User user);
}
