package com.skillswap.dto;

import com.skillswap.entity.SkillCategory;
import com.skillswap.entity.SkillLevel;
import java.time.LocalDateTime;

public class SkillDto {
    private Long id;
    private String skillName;
    private String description;
    private SkillCategory category;
    private SkillLevel level;
    private Long userId;
    private String userName;
    private LocalDateTime createdAt;

    public SkillDto() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public SkillCategory getCategory() { return category; }
    public void setCategory(SkillCategory category) { this.category = category; }

    public SkillLevel getLevel() { return level; }
    public void setLevel(SkillLevel level) { this.level = level; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
