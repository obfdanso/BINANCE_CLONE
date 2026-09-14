# Database Update for Forgot Password Feature

## Issue
The forgot password feature is failing because the database has a check constraint on the `verification_otps` table that doesn't allow the new `PASSWORD_RESET` verification type.

## Error Message
```
ERROR: new row for relation "verification_otps" violates check constraint "verification_otps_verification_type_check"
```

## Solution
Update the database constraint to include the new `PASSWORD_RESET` value.

## Database Update Steps

### Option 1: Using the SQL Script (Recommended)

1. **Connect to your database** (using pgAdmin, psql, or your preferred database client)

2. **Run the migration script:**
   ```sql
   -- Drop the existing constraint
   ALTER TABLE verification_otps DROP CONSTRAINT IF EXISTS verification_otps_verification_type_check;
   
   -- Add the new constraint with PASSWORD_RESET included
   ALTER TABLE verification_otps ADD CONSTRAINT verification_otps_verification_type_check 
   CHECK (verification_type::text = ANY (ARRAY['EMAIL'::character varying, 'MOBILE'::character varying, 'TELEGRAM'::character varying, 'TELEGRAM_LOGIN'::character varying, 'PASSWORD_RESET'::character varying]));
   ```

3. **Verify the update:**
   ```sql
   SELECT conname, pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conname = 'verification_otps_verification_type_check';
   ```

### Option 2: Manual Update

1. **Check current constraint:**
   ```sql
   SELECT conname, pg_get_constraintdef(oid) 
   FROM pg_constraint 
   WHERE conname = 'verification_otps_verification_type_check';
   ```

2. **Drop the constraint:**
   ```sql
   ALTER TABLE verification_otps DROP CONSTRAINT verification_otps_verification_type_check;
   ```

3. **Add the new constraint:**
   ```sql
   ALTER TABLE verification_otps ADD CONSTRAINT verification_otps_verification_type_check 
   CHECK (verification_type::text = ANY (ARRAY['EMAIL'::character varying, 'MOBILE'::character varying, 'TELEGRAM'::character varying, 'TELEGRAM_LOGIN'::character varying, 'PASSWORD_RESET'::character varying]));
   ```

### Option 3: Using psql Command Line

```bash
# Connect to your database
psql -h localhost -U your_username -d your_database_name

# Run the migration
\i update_verification_otps_constraint.sql
```

## Verification

After running the migration, test the forgot password feature:

1. **Request password reset OTP:**
   ```http
   POST http://localhost:8080/api/auth/forgot-password
   Content-Type: application/json
   
   {
       "email": "test@example.com"
   }
   ```

2. **Check application logs** for the OTP (in development mode)

3. **Reset password:**
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

## Expected Result

- The forgot password request should succeed without constraint violation errors
- OTP should be generated and stored in the database
- Password reset should work correctly

## Troubleshooting

### If the constraint update fails:

1. **Check if the table exists:**
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_name = 'verification_otps';
   ```

2. **Check current constraint values:**
   ```sql
   SELECT DISTINCT verification_type FROM verification_otps;
   ```

3. **Check for any existing data conflicts:**
   ```sql
   SELECT * FROM verification_otps WHERE verification_type = 'PASSWORD_RESET';
   ```

### If you need to rollback:

```sql
-- Drop the new constraint
ALTER TABLE verification_otps DROP CONSTRAINT IF EXISTS verification_otps_verification_type_check;

-- Restore the original constraint
ALTER TABLE verification_otps ADD CONSTRAINT verification_otps_verification_type_check 
CHECK (verification_type::text = ANY (ARRAY['EMAIL'::character varying, 'MOBILE'::character varying, 'TELEGRAM'::character varying]));
```

## Notes

- This update is backward compatible
- Existing data will not be affected
- The constraint ensures data integrity for verification types
- Make sure to backup your database before running migrations in production 