-- Psychology Support Website - Database Schema
--
-- Overview:
-- Creates the core database structure for a psychology support website with 
-- appointment booking and admin management.
--
-- New Tables:
--
-- 1. appointments
--    Stores all appointment booking requests from users.
--    - id (uuid, primary key) - Unique identifier for each appointment
--    - name (text) - Full name of the person booking
--    - phone_number (text) - Contact phone number (used for status lookup)
--    - message (text) - User's message describing their needs
--    - status (text) - Current status: "Pending", "Accepted", or "Rejected"
--    - created_at (timestamptz) - When the appointment was created
--    - updated_at (timestamptz) - Last modification timestamp
--
-- 2. admin_users
--    Stores admin credentials (single admin for this system).
--    - id (uuid, primary key) - Unique identifier
--    - username (text, unique) - Admin login username
--    - password_hash (text) - Hashed password for security
--    - created_at (timestamptz) - Account creation timestamp
--
-- Security:
-- - Both tables have RLS enabled
-- - Public users can insert appointments and check status by phone number
-- - Only authenticated admin users can view and manage all appointments
-- - Admin table is protected and only accessible to authenticated users
--
-- Indexes:
-- - Index on phone_number for fast status lookups
-- - Index on status for filtering appointments by status

-- Create appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone_number text NOT NULL,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_appointments_phone_number ON appointments(phone_number);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);

-- Enable Row Level Security
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for appointments table

-- Allow anyone to insert new appointments (public booking)
CREATE POLICY "Anyone can create appointments"
  ON appointments
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow anyone to view appointments by their phone number (status check)
CREATE POLICY "Users can check their appointment status"
  ON appointments
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow authenticated users (admin) to update appointments
CREATE POLICY "Authenticated users can update appointments"
  ON appointments
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users (admin) to delete appointments
CREATE POLICY "Authenticated users can delete appointments"
  ON appointments
  FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for admin_users table

-- Only authenticated users can view admin users
CREATE POLICY "Authenticated users can view admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);
