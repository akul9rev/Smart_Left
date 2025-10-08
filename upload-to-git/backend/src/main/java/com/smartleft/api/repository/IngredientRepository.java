package com.smartleft.api.repository;

import com.smartleft.api.model.Ingredient;
import com.smartleft.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngredientRepository extends JpaRepository<Ingredient, Long> {
    List<Ingredient> findByUser(User user);
}