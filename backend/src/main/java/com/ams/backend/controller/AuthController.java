package com.ams.backend.controller;

import com.ams.backend.security.CustomUserDetails;
import com.ams.backend.security.CustomUserDetailsService;
import com.ams.backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getIdentifier(),
                        request.getPassword()
                )
        );
        
        var userDetails = (CustomUserDetails) userDetailsService.loadUserByUsername(request.getIdentifier());
        var jwtToken = jwtService.generateToken(userDetails);
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(jwtToken)
                .role(userDetails.getUser().getRole().name())
                .name(userDetails.getUser().getName())
                .build());
    }
}
