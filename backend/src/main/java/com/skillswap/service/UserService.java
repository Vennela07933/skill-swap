package com.skillswap.service;

import com.skillswap.dto.UserDto;
import com.skillswap.entity.SkillCategory;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface UserService {
    UserDto getUserById(Long id);
    UserDto getProfileByEmail(String email);
    UserDto updateProfile(Long id, UserDto userDto);
    UserDto updateProfilePicture(Long id, String profilePicturePath);
    Page<UserDto> searchAndFilterUsers(String name, String location, String experience, String availability,
                                       String skillName, SkillCategory category, String sortBy, int page, int size);
    void deleteUser(Long id);
    void blockUser(Long id, boolean block);
    Map<String, Object> getAdminDashboardStats();
}
