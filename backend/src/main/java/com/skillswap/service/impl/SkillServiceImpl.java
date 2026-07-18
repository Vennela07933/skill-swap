package com.skillswap.service.impl;

import com.skillswap.dto.SkillDto;
import com.skillswap.entity.Skill;
import com.skillswap.entity.User;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.mapper.AppMapper;
import com.skillswap.repository.SkillRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.service.SkillService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final UserRepository userRepository;

    public SkillServiceImpl(SkillRepository skillRepository, UserRepository userRepository) {
        this.skillRepository = skillRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public SkillDto createSkill(Long userId, SkillDto skillDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Skill skill = new Skill();
        skill.setSkillName(skillDto.getSkillName());
        skill.setDescription(skillDto.getDescription());
        skill.setCategory(skillDto.getCategory());
        skill.setLevel(skillDto.getLevel());
        skill.setUser(user);

        Skill savedSkill = skillRepository.save(skill);
        return AppMapper.toSkillDto(savedSkill);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SkillDto> getAllSkills(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Skill> skillsPage = skillRepository.findAll(pageable);
        return skillsPage.map(AppMapper::toSkillDto);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillDto getSkillById(Long id) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
        return AppMapper.toSkillDto(skill);
    }

    @Override
    @Transactional
    public SkillDto updateSkill(Long id, SkillDto skillDto) {
        Skill skill = skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found"));

        skill.setSkillName(skillDto.getSkillName());
        skill.setDescription(skillDto.getDescription());
        skill.setCategory(skillDto.getCategory());
        skill.setLevel(skillDto.getLevel());

        Skill updatedSkill = skillRepository.save(skill);
        return AppMapper.toSkillDto(updatedSkill);
    }

    @Override
    @Transactional
    public void deleteSkill(Long id) {
        if (!skillRepository.existsById(id)) {
            throw new ResourceNotFoundException("Skill not found");
        }
        skillRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillDto> getSkillsByUserId(Long userId) {
        return skillRepository.findByUserId(userId).stream()
                .map(AppMapper::toSkillDto)
                .collect(Collectors.toList());
    }
}
