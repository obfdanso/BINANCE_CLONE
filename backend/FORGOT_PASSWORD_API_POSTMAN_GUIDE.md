# Forgot Password API - Postman Testing Guide

This guide provides step-by-step instructions for testing the forgot password functionality using Postman.

## Overview

The forgot password feature consists of two main steps:
1. **Request Password Reset OTP** - User requests a password reset OTP via email
2. **Reset Password** - User verifies OTP and sets a new password

## Base URL
```
http://localhost:8080/api/auth
```

## Step 1: Request Password Reset OTP

### Endpoint
```
POST /forgot-password
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
    "email": "user@example.com"
}
```

### Example Request
```http
POST http://localhost:8080/api/auth/forgot-password
Content-Type: application/json

{
    "email": "user@example.com"
}
```

### Expected Responses

#### Success Response (200 OK)
```json
{
    "message": "Password reset OTP sent to your email. Please check your inbox and verify within 5 minutes."
}
```

#### Error Response - User Not Found (400 Bad Request)
```json
{
    "message": "Error: No user found with this email address!"
}
```

#### Error Response - Invalid Email Format (400 Bad Request)
```json
{
    "message": "Email should be valid"
}
```

### Testing Scenarios

1. **Valid Email (User Exists)**
   - Use an email that exists in the database
   - Should receive success message
   - Check application logs for OTP (in development mode)

2. **Valid Email (User Doesn't Exist)**
   - Use an email that doesn't exist in the database
   - Should receive "No user found" error

3. **Invalid Email Format**
   - Use malformed email (e.g., "invalid-email")
   - Should receive validation error

4. **Empty Email**
   - Send empty email field
   - Should receive validation error

## Step 2: Reset Password

### Endpoint
```
POST /reset-password
```

### Request Headers
```
Content-Type: application/json
```

### Request Body
```json
{
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
}
```

### Example Request
```http
POST http://localhost:8080/api/auth/reset-password
Content-Type: application/json

{
    "email": "user@example.com",
    "otp": "123456",
    "newPassword": "newPassword123",
    "confirmPassword": "newPassword123"
}
```

### Expected Responses

#### Success Response (200 OK)
```json
{
    "message": "Password reset successfully! You can now login with your new password."
}
```

#### Error Response - Passwords Don't Match (400 Bad Request)
```json
{
    "message": "Error: New password and confirm password do not match!"
}
```

#### Error Response - Invalid OTP (400 Bad Request)
```json
{
    "message": "Error: Invalid OTP or OTP expired!"
}
```

#### Error Response - User Not Found (400 Bad Request)
```json
{
    "message": "Error: User not found!"
}
```

#### Error Response - Invalid Password Length (400 Bad Request)
```json
{
    "message": "New password must be between 6 and 40 characters"
}
```

#### Error Response - Invalid OTP Format (400 Bad Request)
```json
{
    "message": "OTP must be 6 digits"
}
```

### Testing Scenarios

1. **Valid Reset (Complete Flow)**
   - First call `/forgot-password` with valid email
   - Get OTP from application logs
   - Call `/reset-password` with correct OTP and matching passwords
   - Should receive success message
   - Verify user can login with new password

2. **Passwords Don't Match**
   - Use different values for `newPassword` and `confirmPassword`
   - Should receive "passwords do not match" error

3. **Invalid OTP**
   - Use wrong OTP code
   - Should receive "Invalid OTP" error

4. **Expired OTP**
   - Wait more than 5 minutes after requesting OTP
   - Try to use the OTP
   - Should receive "OTP expired" error

5. **Invalid Password Length**
   - Use password shorter than 6 characters or longer than 40
   - Should receive validation error

6. **Invalid OTP Format**
   - Use non-numeric OTP or OTP with wrong number of digits
   - Should receive validation error

## Complete Testing Workflow

### 1. Setup Test User
First, ensure you have a test user in the database:
```sql
INSERT INTO users (username, user_id, email, password, created_at) 
VALUES ('testuser', 'USER123', 'test@example.com', '$2a$10$...', NOW());
```

### 2. Test Forgot Password Flow
1. **Request OTP**
   ```http
   POST http://localhost:8080/api/auth/forgot-password
   Content-Type: application/json
   
   {
       "email": "test@example.com"
   }
   ```

2. **Get OTP from Logs**
   - Check application console/logs for: `"DEV MODE - Password Reset OTP for test@example.com: XXXXXX"`

3. **Reset Password**
   ```http
   POST http://localhost:8080/api/auth/reset-password
   Content-Type: application/json
   
   {
       "email": "test@example.com",
       "otp": "XXXXXX",
       "newPassword": "newPassword123",
       "confirmPassword": "newPassword123"
   }
   ```

4. **Verify Login with New Password**
   ```http
   POST http://localhost:8080/api/auth/login
   Content-Type: application/json
   
   {
       "usernameOrEmail": "test@example.com",
       "password": "newPassword123"
   }
   ```

## Security Considerations

1. **OTP Expiry**: OTPs expire after 5 minutes
2. **Rate Limiting**: Consider implementing rate limiting for OTP requests
3. **Email Validation**: Only registered users can request password reset
4. **Password Strength**: Ensure new passwords meet security requirements
5. **OTP Verification**: OTP is marked as used after successful verification

## Troubleshooting

### Common Issues

1. **OTP Not Received**
   - Check application logs for OTP (development mode)
   - Verify email configuration in `application.properties`
   - Check if user exists in database

2. **Invalid OTP Error**
   - Ensure OTP is exactly 6 digits
   - Check if OTP has expired (5 minutes)
   - Verify OTP matches the one in logs

3. **User Not Found Error**
   - Verify email exists in users table
   - Check email spelling and case sensitivity

4. **Password Validation Errors**
   - Ensure password is 6-40 characters
   - Check that both password fields match exactly

### Database Queries for Debugging

```sql
-- Check if user exists
SELECT * FROM users WHERE email = 'test@example.com';

-- Check OTP records
SELECT * FROM verification_otps WHERE email = 'test@example.com' AND verification_type = 'PASSWORD_RESET';

-- Check recent OTPs
SELECT * FROM verification_otps WHERE verification_type = 'PASSWORD_RESET' ORDER BY id DESC LIMIT 5;
```

## Environment Variables

Ensure these are configured in your `application.properties`:

```properties
# Email Configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# JWT Configuration
app.jwtSecret=your-jwt-secret
app.jwtExpirationMs=86400000
```

## Notes

- In development mode, OTPs are logged to console for testing
- OTPs expire after 5 minutes for security
- Password reset OTPs are separate from email verification OTPs
- The system validates that the user exists before sending OTP
- Passwords are encrypted using BCrypt before storage 