package com.smartleft.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class SmartLeftApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartLeftApplication.class, args);
    }
    
    @GetMapping("/")
    public String home() {
        return "Smart-Left API is running!";
    }
}