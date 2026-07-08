package com.ams.backend.controller;

import lombok.Data;

@Data
public class AuthRequest {
    private String identifier; // USN or Email
    private String password;
}
