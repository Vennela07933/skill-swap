package com.skillswap.service;

import com.skillswap.dto.SkillDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SkillService {
    SkillDto createSkill(Long userId, SkillDto skillDto);
    Page<SkillDto> getAllSkills(int page, int size);
    SkillDto getSkillById(Long id);
    SkillDto updateSkill(Long id, SkillDto skillDto);
    void deleteSkill(Long id);
    List<SkillDto> getSkillsByUserId(Long userId);
}
