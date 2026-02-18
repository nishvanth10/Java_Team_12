package com.university.controller;

import com.university.dto.JwtAuthResponse;
import com.university.dto.LoginDto;
import com.university.dto.RegisterDto;
import com.university.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDto loginDto) {
        String token = authService.login(loginDto);
        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @PostMapping("/login-response")
    public ResponseEntity<JwtAuthResponse> loginWithResponse(@RequestBody LoginDto loginDto) {
        JwtAuthResponse response = authService.loginWithResponse(loginDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        String response = authService.register(registerDto);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody com.university.dto.ForgotPasswordDto forgotPasswordDto) {
        authService.requestPasswordReset(forgotPasswordDto.getEmail());
        return new ResponseEntity<>("Password reset requested.", HttpStatus.OK);
    }
}
