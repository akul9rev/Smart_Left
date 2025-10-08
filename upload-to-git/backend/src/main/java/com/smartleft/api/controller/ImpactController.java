package com.smartleft.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smartleft.api.model.ImpactData;
import com.smartleft.api.model.User;
import com.smartleft.api.repository.UserRepository;
import com.smartleft.api.service.ImpactService;

@RestController
@RequestMapping("/api/impact")
@CrossOrigin(origins = "*")
public class ImpactController {

    @Autowired
    private ImpactService impactService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ImpactData getImpactData() {
        User user = getCurrentUser();
        return impactService.getImpactData(user);
    }

    @PostMapping
    public ImpactData updateImpact(@RequestBody ImpactData update) {
        User user = getCurrentUser();
        // Very simple merge: add incoming values, ignore nulls/zeros meaningfully if needed
        ImpactData data = impactService.getImpactData(user);
        data.setMoneySaved(data.getMoneySaved() + Math.max(0, update.getMoneySaved()));
        data.setWastePrevented(data.getWastePrevented() + Math.max(0, update.getWastePrevented()));
        data.setRecipesCreated(Math.max(data.getRecipesCreated(), update.getRecipesCreated()));
        return impactService.save(data);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}