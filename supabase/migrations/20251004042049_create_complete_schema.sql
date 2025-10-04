/*
  # Office Gamification Platform Schema

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - User unique identifier
      - `user_id` (uuid, foreign key) - References auth.users
      - `name` (text) - User's full name
      - `email` (text, unique) - User's email address
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

    - `rules`
      - `id` (uuid, primary key) - Rule unique identifier
      - `title` (text) - Rule title
      - `description` (text) - Rule description
      - `points` (integer) - Points awarded
      - `created_at` (timestamptz) - Creation timestamp
      - `created_by` (uuid, foreign key) - References users table

  2. Security
    - Enable RLS on all tables
    - Users can read and insert their own profile
    - Users can update their own profile
    - Authenticated users can view rewards and rules
    - Authenticated users can manage reward requests
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('employee', 'admin')),
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

-- Create rules table
CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Rewards policies
CREATE POLICY "Authenticated users can manage rewards"
  ON rewards FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Reward requests policies
CREATE POLICY "Users can manage reward requests"
  ON reward_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Rules policies
CREATE POLICY "Users can manage rules"
  ON rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert sample rewards
INSERT INTO rewards (name, description, cost, stock) VALUES
  ('Coffee Voucher', 'Free coffee at the office cafe', 50, 20),
  ('Extra Day Off', 'One additional vacation day', 500, 5),
  ('Lunch with CEO', 'Exclusive lunch meeting with the CEO', 1000, 2),
  ('Gift Card $25', 'Amazon gift card worth $25', 200, 15),
  ('Parking Spot', 'Reserved parking spot for one month', 300, 3)
ON CONFLICT DO NOTHING;

-- Insert sample rules
INSERT INTO rules (title, description, points) VALUES
  ('Early Arrival', 'Arrive at office before 8 AM', 10),
  ('Help a Colleague', 'Assist a team member with their task', 15),
  ('Complete Project Early', 'Finish assigned project ahead of deadline', 50),
  ('Perfect Attendance', 'No absences for a full month', 100),
  ('Organize Team Event', 'Plan and execute a team building activity', 75)
ON CONFLICT DO NOTHING;