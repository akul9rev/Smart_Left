package com.smartleft.api.controller;

import com.smartleft.api.model.Ingredient;
import com.smartleft.api.model.User;
import com.smartleft.api.repository.IngredientRepository;
import com.smartleft.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/ingredients")
@CrossOrigin(origins = "*")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Ingredient> getAllIngredients() {
        User user = getCurrentUser();
        return ingredientRepository.findByUser(user);
    }

    @PostMapping
    public Ingredient addIngredient(@RequestBody IngredientRequest request) {
        User user = getCurrentUser();
        Ingredient ingredient = new Ingredient();
        ingredient.setName(request.getName());
        ingredient.setCategory(request.getCategory());
        ingredient.setExpiryDate(LocalDate.parse(request.getExpiryDate()));
        ingredient.setUser(user);
        return ingredientRepository.save(ingredient);
    }

    @DeleteMapping("/{id}")
    public void deleteIngredient(@PathVariable Long id) {
        User user = getCurrentUser();
        Ingredient ingredient = ingredientRepository.findById(id).orElse(null);
        if (ingredient != null && ingredient.getUser().equals(user)) {
            ingredientRepository.deleteById(id);
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }

    public static class IngredientRequest {
        private String name;
        private String category;
        private String expiryDate;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public String getExpiryDate() { return expiryDate; }
        public void setExpiryDate(String expiryDate) { this.expiryDate = expiryDate; }
    }
}