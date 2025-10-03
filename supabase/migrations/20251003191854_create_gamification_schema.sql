/*
  # Office Gamification Platform Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User unique identifier
      - `name` (text) - User's full name
      - `email` (text, unique) - User's email address
      - `password` (text) - Hashed password
      - `role` (text) - User role: 'employee' or 'admin'
      - `points` (integer) - Current credit points (default 0)
      - `created_at` (timestamptz) - Account creation timestamp
    
    - `rewards`
      - `id` (uuid, primary key) - Reward unique identifier
      - `name` (text) - Reward name
      - `description` (text) - Reward description
      - `cost` (integer) - Points required to redeem
      - `stock` (integer) - Available quantity
      - `created_at` (timestamptz) - Creation timestamp
    
    - `reward_requests`
      - `id` (uuid, primary key) - Request unique identifier
      - `employee_id` (uuid, foreign key) - References users table
      - `reward_id` (uuid, foreign key) - References rewards table
      - `status` (text) - Request status: 'pending', 'approved', or 'rejected'
      - `created_at` (timestamptz) - Request creation timestamp
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Users can read their own profile data
    - Admins can read all user data
    - All authenticated users can view rewards
    - Employees can create reward requests for themselves
    - Employees can view their own reward requests
    - Admins can view and update all reward requests
    - Admins can manage rewards and update user points
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  role text NOT NULL CHECK (role IN ('employee', 'admin')),
  points integer DEFAULT 0 CHECK (points >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create rewards table
CREATE TABLE IF NOT EXISTS rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  cost integer NOT NULL CHECK (cost >= 0),
  stock integer DEFAULT 0 CHECK (stock >= 0),
  created_at timestamptz DEFAULT now()
);

-- Create reward_requests table
CREATE TABLE IF NOT EXISTS reward_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reward_id uuid NOT NULL REFERENCES rewards(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_requests ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (id = (SELECT id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can read all users"
  ON users FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can update user points"
  ON users FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

-- Rewards table policies
CREATE POLICY "Authenticated users can view rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can insert rewards"
  ON rewards FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can update rewards"
  ON rewards FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can delete rewards"
  ON rewards FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

-- Reward requests table policies
CREATE POLICY "Employees can create reward requests"
  ON reward_requests FOR INSERT
  TO authenticated
  WITH CHECK (employee_id = (SELECT id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Users can view own reward requests"
  ON reward_requests FOR SELECT
  TO authenticated
  USING (employee_id = (SELECT id FROM users WHERE email = auth.jwt()->>'email'));

CREATE POLICY "Admins can view all reward requests"
  ON reward_requests FOR SELECT
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can update reward requests"
  ON reward_requests FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

-- Insert sample data
INSERT INTO users (name, email, password, role, points) VALUES
  ('Admin User', 'admin@company.com', 'admin123', 'admin', 0),
  ('John Doe', 'john@company.com', 'pass123', 'employee', 500),
  ('Jane Smith', 'jane@company.com', 'pass123', 'employee', 750)
ON CONFLICT (email) DO NOTHING;

INSERT INTO rewards (name, description, cost, stock) VALUES
  ('Coffee Voucher', 'Free coffee at the office cafe', 50, 20),
  ('Extra Day Off', 'One additional vacation day', 500, 5),
  ('Lunch with CEO', 'Exclusive lunch meeting with the CEO', 1000, 2),
  ('Gift Card $25', 'Amazon gift card worth $25', 200, 15),
  ('Parking Spot', 'Reserved parking spot for one month', 300, 3)
ON CONFLICT DO NOTHING;