package com.samurai74.minimalblog.controllers;

import com.samurai74.minimalblog.domain.dtos.AuthResponse;
import com.samurai74.minimalblog.domain.dtos.LoginRequest;
import com.samurai74.minimalblog.services.AuthenticationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(path = "/api/v1/auth")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Authentication")
public class AuthController {
    private final AuthenticationService authenticationService;

    @PostMapping(path = "/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
       UserDetails userDetails= authenticationService.authenticate(loginRequest.getEmail(),loginRequest.getPassword());
       log.warn("username/email "+userDetails.getUsername());
       String tokenValue= authenticationService.generateToken(userDetails);
       log.info("token value "+tokenValue);
       var authRes = AuthResponse.builder().token(tokenValue).expiresIn(86400).build();
       return ResponseEntity.ok(authRes);
    }
}
