# Forgot Password Feature - Quick Reference

## Overview
The forgot password feature allows users to reset their password using email OTP verification.

## Flow
1. User requests password reset → OTP sent to email
2. User enters OTP + new password → Password updated

## Endpoints

### 1. Request Password Reset OTP
```
POST /api/auth/forgot-password
```

**Request:**
```json
{
    "email": "user@example.com"
}
```

**Response:**
```json
{
    "message": "Password reset OTP sent to your email. Please check your inbox and verify within 5 minutes."
}
```

### 2. Reset Password
```
POST /api/auth/reset-password
```

**Request:**
```json
{
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
}
```

**Response:**
```json
{
    "message": "Password reset successfully! You can now login with your new password."
}
```

## Key Features

- **OTP Expiry**: 5 minutes
- **OTP Format**: 6 digits
- **Password Validation**: 6-40 characters
- **Email Verification**: User must exist in database
- **Security**: OTP marked as used after verification

## Error Messages

| Error | Message |
|-------|---------|
| User not found | "Error: No user found with this email address!" |
| Invalid OTP | "Error: Invalid OTP or OTP expired!" |
| Passwords don't match | "Error: New password and confirm password do not match!" |
| Invalid password length | "New password must be between 6 and 40 characters" |
| Invalid OTP format | "OTP must be 6 digits" |

## Testing

### Development Mode
- OTPs are logged to console: `"DEV MODE - Password Reset OTP for email: XXXXXX"`

### Complete Test Flow
1. Request OTP: `POST /api/auth/forgot-password`
2. Get OTP from logs
3. Reset password: `POST /api/auth/reset-password`
4. Verify login with new password: `POST /api/auth/login`

## Database

### VerificationOtp Table
- New verification type: `PASSWORD_RESET`
- Stores OTP, expiry time, and verification status

### User Table
- Password field updated with BCrypt hash

## Security Notes

- Only registered users can request password reset
- OTPs expire after 5 minutes
- Passwords are encrypted before storage
- OTP verification prevents reuse
- Email validation ensures user exists 