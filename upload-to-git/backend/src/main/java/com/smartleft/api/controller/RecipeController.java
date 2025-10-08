package com.smartleft.api.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smartleft.api.model.Recipe;
import com.smartleft.api.model.User;
import com.smartleft.api.repository.RecipeRepository;
import com.smartleft.api.repository.UserRepository;
import com.smartleft.api.service.ImpactService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/recipes")
@CrossOrigin(origins = "*")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;
    
    @Autowired
    private ImpactService impactService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Recipe> getAllRecipes() {
        User user = getCurrentUser();
        return recipeRepository.findByUser(user);
    }

    @PostMapping
    public Recipe addRecipe(@RequestBody Recipe recipe) {
        User user = getCurrentUser();
        recipe.setUser(user);
        Recipe savedRecipe = recipeRepository.save(recipe);
        impactService.updateImpactOnRecipeCreated(user);
        return savedRecipe;
    }

    // Suggest recipes endpoint – simple rule-based placeholder until AI service is integrated
    @PostMapping("/suggest")
    public List<Recipe> suggestRecipes(@RequestBody Map<String, Object> payload) {
        // payload structure: { userId: string, ingredients: [Ingredient], preferences: { time, skill, equipment } }
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> ingredients = (List<Map<String, Object>>) payload.getOrDefault("ingredients", List.of());
        @SuppressWarnings("unchecked")
        Map<String, Object> preferences = (Map<String, Object>) payload.getOrDefault("preferences", Map.of());

        List<String> names = ingredients.stream()
                .map(m -> String.valueOf(m.getOrDefault("name", "")).toLowerCase())
                .collect(Collectors.toList());

        // Minimal in-memory recipe set
        List<Recipe> db = List.of(
                new Recipe("Tomato Pasta", "Cook pasta. Saute tomatoes with garlic and olive oil. Mix and serve.", List.of("Tomatoes", "Pasta", "Garlic", "Olive Oil"), null),
                new Recipe("Chicken Stir Fry", "Stir-fry chicken. Add vegetables and sauce. Serve over rice.", List.of("Chicken", "Rice", "Vegetables", "Soy Sauce"), null),
                new Recipe("Vegetable Soup", "Saute vegetables. Add broth and simmer 20 min.", List.of("Tomatoes", "Carrots", "Broth", "Herbs"), null)
        );

        return db.stream()
                .filter(r -> r.getIngredients().stream().anyMatch(ing -> names.stream().anyMatch(n -> ing.toLowerCase().contains(n) || n.contains(ing.toLowerCase()))))
                .limit(8)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{id}")
    public void deleteRecipe(@PathVariable Long id) {
        User user = getCurrentUser();
        Recipe recipe = recipeRepository.findById(id).orElse(null);
        if (recipe != null && recipe.getUser().equals(user)) {
            recipeRepository.deleteById(id);
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElse(null);
    }
}