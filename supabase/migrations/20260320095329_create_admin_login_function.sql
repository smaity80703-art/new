-- Create Admin Login Verification Function
--
-- Overview:
-- Creates a PostgreSQL function to securely verify admin login credentials.
--
-- New Function:
-- - verify_admin_login(p_username, p_password)
--   - Accepts username and password as parameters
--   - Checks if credentials match an admin user in the database
--   - Returns boolean (true if valid, false if invalid)
--   - Uses bcrypt to compare password hash
--
-- Security:
-- - Password comparison is done server-side using stored hash
-- - Function is marked as SECURITY DEFINER to bypass RLS
-- - Returns only boolean, never exposes password hash

-- Create function to verify admin login
CREATE OR REPLACE FUNCTION verify_admin_login(
  p_username text,
  p_password text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_password_hash text;
BEGIN
  -- Get the password hash for the username
  SELECT password_hash INTO v_password_hash
  FROM admin_users
  WHERE username = p_username;
  
  -- If no user found, return false
  IF v_password_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Compare the provided password with the stored hash
  RETURN (v_password_hash = crypt(p_password, v_password_hash));
END;
$$;
