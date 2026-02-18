package com.university.dto;

import com.university.enums.Role;
import lombok.Data;

@Data
public class RegisterDto {
    private String username;
    private String email;
    private String password;
    private Role role;
}
