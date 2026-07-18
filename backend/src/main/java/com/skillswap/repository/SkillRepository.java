package com.skillswap.repository;

import com.skillswap.entity.Skill;
import com.skillswap.entity.SkillCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    Page<Skill> findByUserId(Long userId, Pageable pageable);
    List<Skill> findByUserId(Long userId);
    Page<Skill> findByCategory(SkillCategory category, Pageable pageable);
    Page<Skill> findBySkillNameContainingIgnoreCase(String skillName, Pageable pageable);
}
