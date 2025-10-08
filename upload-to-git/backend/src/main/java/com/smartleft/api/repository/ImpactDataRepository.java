package com.smartleft.api.repository;

import com.smartleft.api.model.ImpactData;
import com.smartleft.api.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ImpactDataRepository extends JpaRepository<ImpactData, Long> {
    Optional<ImpactData> findByUser(User user);
}