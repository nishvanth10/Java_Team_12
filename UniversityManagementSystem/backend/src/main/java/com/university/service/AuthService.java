package com.university.service;

import com.university.dto.JwtAuthResponse;
import com.university.dto.LoginDto;
import com.university.dto.RegisterDto;

public interface AuthService {
    String login(LoginDto loginDto);

    String register(RegisterDto registerDto);

    void requestPasswordReset(String email);

    JwtAuthResponse loginWithResponse(LoginDto loginDto);
}
