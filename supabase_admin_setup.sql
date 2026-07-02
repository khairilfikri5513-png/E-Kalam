-- --------------------------------------------------------
-- E-Kalam Secure Admin Database Setup
-- Run this SQL in your Supabase SQL Editor
-- --------------------------------------------------------

-- 1. Enable pgcrypto extension for secure password hashing and random bytes
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Create the admin credentials table
CREATE TABLE IF NOT EXISTS public.admin_credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    failed_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    session_token TEXT,
    token_expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) to hide hashes from public client queries
ALTER TABLE public.admin_credentials ENABLE ROW LEVEL SECURITY;

-- No direct SELECT, INSERT, UPDATE, or DELETE policies are granted to anon users.
-- Only the secure RPC functions (Security Definer) can access this table.

-- 4. Insert the admin user with password hashed using bcrypt ('bf') with cost factor 10
INSERT INTO public.admin_credentials (username, password_hash)
VALUES (
    'khairilfikri',
    crypt('khairil1014', gen_salt('bf', 10))
)
ON CONFLICT (username) DO UPDATE
SET password_hash = crypt('khairil1014', gen_salt('bf', 10)),
    failed_attempts = 0,
    locked_until = NULL;

-- 5. Create the secure RPC function for Admin Login & Rate-Limiting Lockout
CREATE OR REPLACE FUNCTION verify_admin_login(p_username text, p_password text)
RETURNS json AS $$
DECLARE
    v_id uuid;
    v_hash text;
    v_failed int;
    v_locked timestamptz;
    v_token text;
    v_expires timestamptz;
BEGIN
    -- Retrieve credentials
    SELECT id, password_hash, failed_attempts, locked_until
    INTO v_id, v_hash, v_failed, v_locked
    FROM public.admin_credentials
    WHERE username = p_username;

    -- Handle user not found (return generic message for security)
    IF v_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Username atau kata laluan tidak betul.');
    END IF;

    -- Check if account is locked
    IF v_locked IS NOT NULL AND v_locked > now() THEN
        RETURN json_build_object(
            'success', false, 
            'error', concat('Akaun anda telah dikunci seketika kerana terlalu banyak cubaan gagal. Sila cuba lagi selepas ', to_char(v_locked, 'HH24:MI:SS'), '.')
        );
    END IF;

    -- Verify the password
    IF v_hash = crypt(p_password, v_hash) THEN
        -- Successful authentication: Reset failures and lockout
        UPDATE public.admin_credentials
        SET failed_attempts = 0, locked_until = NULL
        WHERE id = v_id;

        -- Generate a cryptographically secure random session token
        v_token := encode(gen_random_bytes(32), 'hex');
        v_expires := now() + interval '2 hours'; -- Token valid for 2 hours

        UPDATE public.admin_credentials
        SET session_token = v_token, token_expires_at = v_expires
        WHERE id = v_id;

        RETURN json_build_object(
            'success', true, 
            'token', v_token, 
            'username', p_username,
            'expires_at', v_expires
        );
    ELSE
        -- Incorrect password: Increment failure count
        v_failed := COALESCE(v_failed, 0) + 1;
        
        IF v_failed >= 5 THEN
            -- Lock account for 15 minutes after 5 failed attempts
            v_locked := now() + interval '15 minutes';
            
            UPDATE public.admin_credentials
            SET failed_attempts = v_failed, locked_until = v_locked
            WHERE id = v_id;
            
            RETURN json_build_object(
                'success', false, 
                'error', 'Akaun anda dikunci selama 15 minit kerana terlalu banyak cubaan gagal.'
            );
        ELSE
            UPDATE public.admin_credentials
            SET failed_attempts = v_failed
            WHERE id = v_id;
            
            RETURN json_build_object(
                'success', false, 
                'error', concat('Username atau kata laluan tidak betul. Tinggal ', (5 - v_failed)::text, ' cubaan sebelum akaun dikunci.')
            );
        END IF;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Create the secure RPC function to verify the active session token
CREATE OR REPLACE FUNCTION verify_admin_token(p_token text)
RETURNS json AS $$
DECLARE
    v_username text;
    v_expires timestamptz;
BEGIN
    SELECT username, token_expires_at
    INTO v_username, v_expires
    FROM public.admin_credentials
    WHERE session_token = p_token;

    -- Return false if token is not found or has expired
    IF v_username IS NULL OR v_expires < now() THEN
        RETURN json_build_object('valid', false);
    END IF;

    RETURN json_build_object('valid', true, 'username', v_username);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
