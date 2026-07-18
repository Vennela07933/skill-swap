package com.skillswap.controller;

import com.skillswap.dto.UserDto;
import com.skillswap.entity.SkillCategory;
import com.skillswap.exception.BadRequestException;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.UserService;
import com.skillswap.util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final String uploadDir;

    public UserController(UserService userService, @Value("${app.upload.dir}") String uploadDir) {
        this.userService = userService;
        this.uploadDir = uploadDir;
    }

    @GetMapping
    public ResponseEntity<Page<UserDto>> getUsers(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String experience,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) String skillName,
            @RequestParam(required = false) SkillCategory category,
            @RequestParam(required = false, defaultValue = "newest") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Page<UserDto> users = userService.searchAndFilterUsers(name, location, experience, availability, skillName, category, sortBy, page, size);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDto> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDto profile = userService.getUserById(principal.getId());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDto> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserDto userDto
    ) {
        UserDto updated = userService.updateProfile(principal.getId(), userDto);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/profile/picture")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("file") MultipartFile file
    ) {
        if (file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }
        try {
            String filename = FileUploadUtil.saveFile(uploadDir, file);
            // We store the static resource URL path in database (e.g. "/uploads/filename")
            String fileUrl = "/uploads/" + filename;
            UserDto updated = userService.updateProfilePicture(principal.getId(), fileUrl);
            return ResponseEntity.ok(updated);
        } catch (IOException e) {
            throw new BadRequestException("Failed to store file: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long id) {
        UserDto user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long id,
            @RequestBody UserDto userDto,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        // Only user themselves or Admin can update this path
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));

        if (!principal.getId().equals(id) && !isAdmin) {
            throw new BadRequestException("You are not authorized to update this profile");
        }

        UserDto updated = userService.updateProfile(id, userDto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/block")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> blockUser(
            @PathVariable Long id,
            @RequestParam boolean block
    ) {
        userService.blockUser(id, block);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User status updated. Blocked = " + block);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        Map<String, Object> stats = userService.getAdminDashboardStats();
        return ResponseEntity.ok(stats);
    }
}
