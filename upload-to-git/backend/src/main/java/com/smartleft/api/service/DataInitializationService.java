package com.smartleft.api.service;

import com.smartleft.api.model.User;
import com.smartleft.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class DataInitializationService implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            System.out.println("Starting data initialization...");
            
            // Create demo user if it doesn't exist
            if (!userRepository.existsByEmail("demo@smartleft.com")) {
                System.out.println("Creating demo user...");
                User demoUser = new User();
                demoUser.setEmail("demo@smartleft.com");
                demoUser.setPassword(passwordEncoder.encode("demo123"));
                demoUser.setFirstName("Demo");
                demoUser.setLastName("User");
                
                User savedUser = userRepository.save(demoUser);
                System.out.println("Demo user created successfully: " + savedUser.getEmail());
                System.out.println("Demo user ID: " + savedUser.getId());
            } else {
                System.out.println("Demo user already exists: demo@smartleft.com");
            }
            
            // List all users for debugging
            long userCount = userRepository.count();
            System.out.println("Total users in database: " + userCount);
            
        } catch (Exception e) {
            System.err.println("Error during data initialization: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
