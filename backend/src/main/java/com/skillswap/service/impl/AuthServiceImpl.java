package com.skillswap.service.impl;

import com.skillswap.dto.*;
import com.skillswap.entity.Role;
import com.skillswap.entity.User;
import com.skillswap.exception.BadRequestException;
import com.skillswap.exception.ResourceNotFoundException;
import com.skillswap.exception.UnauthorizedException;
import com.skillswap.mapper.AppMapper;
import com.skillswap.repository.ReviewRepository;
import com.skillswap.repository.UserRepository;
import com.skillswap.security.JwtTokenProvider;
import com.skillswap.security.UserPrincipal;
import com.skillswap.service.AuthService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    // Temporary memory store for forgot-password tokens
    private final Map<String, String> passwordResetTokens = new ConcurrentHashMap<>();

    public AuthServiceImpl(UserRepository userRepository,
                            ReviewRepository reviewRepository,
                            PasswordEncoder passwordEncoder,
                            JwtTokenProvider tokenProvider,
                            AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.reviewRepository = reviewRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setLocation(request.getLocation());
        user.setBio(request.getBio());
        user.setSkillsWanted(request.getSkillsWanted());
        user.setAvailability(request.getAvailability());
        user.setExperience(request.getExperience());

        // First user can be an Admin for demonstration purposes if needed, otherwise default to USER.
        // Let's make admin@skillswap.com Admin by default so they can log in instantly.
        if (request.getEmail().equalsIgnoreCase("admin@skillswap.com")) {
            user.setRole(Role.ADMIN);
        } else {
            user.setRole(Role.USER);
        }

        User savedUser = userRepository.save(user);

        // Generate tokens
        String token = tokenProvider.generateTokenFromUserId(savedUser.getId());
        String refreshToken = tokenProvider.generateRefreshTokenFromUserId(savedUser.getId());

        UserDto userDto = AppMapper.toUserDto(savedUser, 0.0);
        return new AuthResponse(token, refreshToken, userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(authentication);

        Double avgRating = reviewRepository.getAverageRatingForUser(user.getId());
        UserDto userDto = AppMapper.toUserDto(user, avgRating);

        return new AuthResponse(token, refreshToken, userDto);
    }

    @Override
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        Long userId = tokenProvider.getUserIdFromJWT(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newToken = tokenProvider.generateTokenFromUserId(userId);
        String newRefreshToken = tokenProvider.generateRefreshTokenFromUserId(userId);

        Double avgRating = reviewRepository.getAverageRatingForUser(userId);
        UserDto userDto = AppMapper.toUserDto(user, avgRating);

        return new AuthResponse(newToken, newRefreshToken, userDto);
    }

    @Override
    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new BadRequestException("Incorrect old password");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User with this email does not exist"));

        String token = UUID.randomUUID().toString();
        passwordResetTokens.put(token, user.getEmail());

        // In a real-world scenario, you would send this token via email.
        System.out.println("----------------------------------------");
        System.out.println("PASSWORD RESET TOKEN FOR " + user.getEmail() + " : " + token);
        System.out.println("----------------------------------------");

        return token;
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        String email = passwordResetTokens.get(request.getToken());
        if (email == null) {
            throw new BadRequestException("Invalid or expired password reset token");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        passwordResetTokens.remove(request.getToken());
    }
}
