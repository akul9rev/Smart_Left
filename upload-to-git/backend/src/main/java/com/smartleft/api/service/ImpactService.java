package com.smartleft.api.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smartleft.api.model.ImpactData;
import com.smartleft.api.model.User;
import com.smartleft.api.repository.ImpactDataRepository;

@Service
public class ImpactService {

    @Autowired
    private ImpactDataRepository impactDataRepository;

    public ImpactData getImpactData(User user) {
        Optional<ImpactData> impactDataOpt = impactDataRepository.findByUser(user);
        return impactDataOpt.orElseGet(() -> {
            ImpactData newImpactData = new ImpactData(user);
            return impactDataRepository.save(newImpactData);
        });
    }

    public void updateImpactOnRecipeCreated(User user) {
        ImpactData impactData = getImpactData(user);
        impactData.setRecipesCreated(impactData.getRecipesCreated() + 1);
        impactData.setMoneySaved(impactData.getMoneySaved() + 5.0); // Assuming $5 saved per recipe
        impactData.setWastePrevented(impactData.getWastePrevented() + 0.5); // Assuming 0.5kg waste prevented
        impactDataRepository.save(impactData);
    }

    public ImpactData save(ImpactData data) {
        return impactDataRepository.save(data);
    }
}