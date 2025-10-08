package com.smartleft.api.model;

import jakarta.persistence.*;

@Entity
@Table(name = "impact_data")
public class ImpactData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
    
    private double moneySaved;
    private double wastePrevented;
    private int recipesCreated;

    public ImpactData() {
    }

    public ImpactData(User user) {
        this.user = user;
        this.moneySaved = 0;
        this.wastePrevented = 0;
        this.recipesCreated = 0;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public double getMoneySaved() {
        return moneySaved;
    }

    public void setMoneySaved(double moneySaved) {
        this.moneySaved = moneySaved;
    }

    public double getWastePrevented() {
        return wastePrevented;
    }

    public void setWastePrevented(double wastePrevented) {
        this.wastePrevented = wastePrevented;
    }

    public int getRecipesCreated() {
        return recipesCreated;
    }

    public void setRecipesCreated(int recipesCreated) {
        this.recipesCreated = recipesCreated;
    }
}