package com.smartleft.api.controller;

import com.smartleft.api.dto.JwtResponse;
import com.smartleft.api.dto.LoginRequest;
import com.smartleft.api.dto.RegisterRequest;
import com.smartleft.api.model.User;
import com.smartleft.api.repository.UserRepository;
import com.smartleft.api.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            System.out.println("Login attempt for email: " + loginRequest.getEmail());
            
            // Demo login shortcut - always works with these credentials
            if (loginRequest.getEmail().equals("demo@smartleft.com") && 
                loginRequest.getPassword().equals("demo123")) {
                
                User user = userRepository.findByEmail("demo@smartleft.com").orElse(null);
                if (user == null) {
                    // Create demo user if it doesn't exist
                    user = new User();
                    user.setEmail("demo@smartleft.com");
                    user.setPassword(passwordEncoder.encode("demo123"));
                    user.setFirstName("Demo");
                    user.setLastName("User");
                    userRepository.save(user);
                }
                
                // Create authentication token manually
                org.springframework.security.core.userdetails.User userDetails = 
                    new org.springframework.security.core.userdetails.User(
                        user.getEmail(), user.getPassword(), new ArrayList<>());
                
                String jwt = jwtUtil.generateToken(userDetails);
                
                return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getFirstName(), user.getLastName()));
            }
            
            // Regular authentication flow
            User user = userRepository.findByEmail(loginRequest.getEmail()).orElse(null);
            if (user == null) {
                System.out.println("User not found: " + loginRequest.getEmail());
                return ResponseEntity.badRequest().body("User not found");
            }
            
            System.out.println("User found: " + user.getEmail() + ", ID: " + user.getId());
            
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtil.generateToken((org.springframework.security.core.userdetails.User) authentication.getPrincipal());

            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getFirstName(), user.getLastName()));
            
        } catch (Exception e) {
            System.err.println("Login error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Error: Email is already taken!");
        }

        User user = new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}
