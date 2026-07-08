package com.ams.backend.security;

import com.ams.backend.entity.Student;
import com.ams.backend.entity.User;
import com.ams.backend.repository.StudentRepository;
import com.ams.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        // Check if identifier is an email (Teacher/Admin login)
        if (identifier.contains("@")) {
            User user = userRepository.findByEmail(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + identifier));
            return new CustomUserDetails(user);
        } else {
            // Treat identifier as USN (Roll Number)
            Student student = studentRepository.findByRollNumber(identifier)
                    .orElseThrow(() -> new UsernameNotFoundException("Student not found with USN: " + identifier));
            return new CustomUserDetails(student.getUser());
        }
    }
}
