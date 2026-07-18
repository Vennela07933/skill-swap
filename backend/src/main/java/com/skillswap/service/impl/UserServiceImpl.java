package com.skillswap.service.impl;

import com.skillswap.dto.SkillDto;
import com.skillswap.dto.UserDto;
import com.skillswap.entity.ExchangeStatus;
import com.skillswap.entity.SkillCategory;
import com.skillswap.entity.User;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.mapper.AppMapper;
import com.skillswap.repository.*;
import com.skillswap.service.UserService;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    private final ExchangeRequestRepository exchangeRequestRepository;
    private final ReviewRepository reviewRepository;

    public UserServiceImpl(UserRepository userRepository,
                           SkillRepository skillRepository,
                           ExchangeRequestRepository exchangeRequestRepository,
                           ReviewRepository reviewRepository) {
        this.userRepository = userRepository;
        this.skillRepository = skillRepository;
        this.exchangeRequestRepository = exchangeRequestRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        Double avgRating = reviewRepository.getAverageRatingForUser(id);
        return AppMapper.toUserDto(user, avgRating);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        Double avgRating = reviewRepository.getAverageRatingForUser(user.getId());
        return AppMapper.toUserDto(user, avgRating);
    }

    @Override
    @Transactional
    public UserDto updateProfile(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setName(userDto.getName());
        user.setPhone(userDto.getPhone());
        user.setLocation(userDto.getLocation());
        user.setBio(userDto.getBio());
        user.setSkillsWanted(userDto.getSkillsWanted());
        user.setAvailability(userDto.getAvailability());
        user.setExperience(userDto.getExperience());

        User updatedUser = userRepository.save(user);
        Double avgRating = reviewRepository.getAverageRatingForUser(id);
        return AppMapper.toUserDto(updatedUser, avgRating);
    }

    @Override
    @Transactional
    public UserDto updateProfilePicture(Long id, String profilePicturePath) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setProfilePicture(profilePicturePath);
        User updatedUser = userRepository.save(user);
        Double avgRating = reviewRepository.getAverageRatingForUser(id);
        return AppMapper.toUserDto(updatedUser, avgRating);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDto> searchAndFilterUsers(String name, String location, String experience, String availability,
                                             String skillName, SkillCategory category, String sortBy, int page, int size) {
        Sort sort = Sort.by("createdAt").descending();

        if (sortBy != null && !sortBy.trim().isEmpty()) {
            switch (sortBy.toLowerCase()) {
                case "oldest":
                    sort = Sort.by("createdAt").ascending();
                    break;
                case "alphabetical":
                    sort = Sort.by("name").ascending();
                    break;
                case "most skilled":
                    sort = Sort.by("experience").descending();
                    break;
                case "newest":
                default:
                    sort = Sort.by("createdAt").descending();
                    break;
            }
        }

        Pageable pageable = PageRequest.of(page, size, sort);

        // Treat empty string fields as null for DB query matching
        String nameQuery = (name == null || name.trim().isEmpty()) ? null : name.trim();
        String locQuery = (location == null || location.trim().isEmpty()) ? null : location.trim();
        String expQuery = (experience == null || experience.trim().isEmpty()) ? null : experience.trim();
        String availQuery = (availability == null || availability.trim().isEmpty()) ? null : availability.trim();
        String skillQuery = (skillName == null || skillName.trim().isEmpty()) ? null : skillName.trim();

        Page<User> usersPage = userRepository.searchUsers(nameQuery, locQuery, expQuery, availQuery, skillQuery, category, pageable);

        List<UserDto> dtos = usersPage.getContent().stream()
                .map(user -> {
                    Double avg = reviewRepository.getAverageRatingForUser(user.getId());
                    return AppMapper.toUserDto(user, avg);
                })
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, usersPage.getTotalElements());
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    @Transactional
    public void blockUser(Long id, boolean block) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setBlocked(block);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getAdminDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalSkills", skillRepository.count());
        stats.put("totalRequests", exchangeRequestRepository.count());
        stats.put("completedExchanges", exchangeRequestRepository.countByStatus(ExchangeStatus.COMPLETED));
        stats.put("pendingRequests", exchangeRequestRepository.countByStatus(ExchangeStatus.PENDING));

        // Fetch top 5 recent users
        Pageable topFive = PageRequest.of(0, 5, Sort.by("createdAt").descending());
        List<UserDto> recentUsers = userRepository.findAll(topFive).getContent().stream()
                .map(user -> AppMapper.toUserDto(user, reviewRepository.getAverageRatingForUser(user.getId())))
                .collect(Collectors.toList());
        stats.put("recentUsers", recentUsers);

        // Fetch top 5 recent skills
        List<SkillDto> recentSkills = skillRepository.findAll(topFive).getContent().stream()
                .map(AppMapper::toSkillDto)
                .collect(Collectors.toList());
        stats.put("recentSkills", recentSkills);

        return stats;
    }
}
