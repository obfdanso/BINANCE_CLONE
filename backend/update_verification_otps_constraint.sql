-- Migration script to update verification_otps table constraint
-- This adds PASSWORD_RESET to the allowed verification_type values

-- Step 1: Drop the existing constraint
ALTER TABLE verification_otps DROP CONSTRAINT IF EXISTS verification_otps_verification_type_check;

-- Step 2: Add the new constraint with PASSWORD_RESET included
ALTER TABLE verification_otps ADD CONSTRAINT verification_otps_verification_type_check 
CHECK (verification_type::text = ANY (ARRAY['EMAIL'::character varying, 'MOBILE'::character varying, 'TELEGRAM'::character varying, 'TELEGRAM_LOGIN'::character varying, 'PASSWORD_RESET'::character varying]));

-- Verify the constraint was added successfully
SELECT conname, pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'verification_otps_verification_type_check'; 