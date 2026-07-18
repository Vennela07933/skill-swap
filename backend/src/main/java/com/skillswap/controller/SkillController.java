package com.skillswap.controller;

import com.skillswap.dto.SkillDto;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.SkillService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @PostMapping
    public ResponseEntity<SkillDto> createSkill(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody SkillDto skillDto
    ) {
        SkillDto created = skillService.createSkill(principal.getId(), skillDto);
        return ResponseEntity.ok(created);
    }

    @GetMapping
    public ResponseEntity<Page<SkillDto>> getAllSkills(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<SkillDto> skills = skillService.getAllSkills(page, size);
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> getSkillById(@PathVariable Long id) {
        SkillDto skill = skillService.getSkillById(id);
        return ResponseEntity.ok(skill);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> updateSkill(
            @PathVariable Long id,
            @RequestBody SkillDto skillDto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SkillDto currentSkill = skillService.getSkillById(id);
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!currentSkill.getUserId().equals(principal.getId()) && !isAdmin) {
            throw new IllegalArgumentException("You are not authorized to update this skill");
        }

        SkillDto updated = skillService.updateSkill(id, skillDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteSkill(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        SkillDto currentSkill = skillService.getSkillById(id);
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!currentSkill.getUserId().equals(principal.getId()) && !isAdmin) {
            throw new IllegalArgumentException("You are not authorized to delete this skill");
        }

        skillService.deleteSkill(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Skill deleted successfully");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkillDto>> getSkillsByUserId(@PathVariable Long userId) {
        List<SkillDto> skills = skillService.getSkillsByUserId(userId);
        return ResponseEntity.ok(skills);
    }
}
