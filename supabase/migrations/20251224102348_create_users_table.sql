/*
  # User Registration System - Users Table

  ## Overview
  Creates the core users table for the custom registration system with email/password authentication.

  ## New Tables
  
  ### `users`
  Stores registered user accounts with hashed passwords.
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier for each user, auto-generated
  - `email` (text, unique, not null) - User's email address, must be unique across the system
  - `password_hash` (text, not null) - Hashed password (never stores plain text)
  - `created_at` (timestamptz, default now()) - Timestamp of user registration
  
  ## Security
  
  ### Row Level Security (RLS)
  - RLS is enabled on the `users` table for data protection
  - Insert policy allows unauthenticated registration (public access for signup)
  - No select/update/delete policies by default (can be added when authentication is implemented)
  
  ### Important Notes
  1. Passwords are NEVER stored in plain text - only hashed values
  2. Email uniqueness is enforced at the database level
  3. The registration Edge Function handles all validation before insertion
  4. Created timestamp is automatically set on insertion
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow public registration (inserts only)
-- This policy allows the registration endpoint to create new users
CREATE POLICY "Allow public registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create index on email for faster lookups during uniqueness checks
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);