-- Setup Admin Authentication
--
-- Overview:
-- Configures authentication for the admin user and inserts a default admin account.
--
-- Changes:
-- 1. Creates a helper function to hash passwords using pgcrypto extension
-- 2. Inserts default admin user with credentials:
--    - Username: admin
--    - Password: admin123 (should be changed in production)
--
-- Security:
-- - Uses pgcrypto extension for secure password hashing with bcrypt
-- - Password is stored as a hash, never in plain text

-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Insert default admin user (username: admin, password: admin123)
-- Using crypt function to hash the password with bcrypt
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', crypt('admin123', gen_salt('bf')))
ON CONFLICT (username) DO NOTHING;
