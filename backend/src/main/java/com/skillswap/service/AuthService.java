package com.skillswap.service;

import com.skillswap.dto.*;

public interface AuthService {
    AuthResponse register(RegisterRequest registerRequest);
    AuthResponse login(LoginRequest loginRequest);
    AuthResponse refreshToken(String refreshToken);
    void changePassword(Long userId, ChangePasswordRequest changePasswordRequest);
    String forgotPassword(ForgotPasswordRequest forgotPasswordRequest);
    void resetPassword(ResetPasswordRequest resetPasswordRequest);
}
