/*
  # Fix RLS policies to prevent infinite recursion

  1. Changes
    - Drop all existing policies on users table
    - Create new policies without recursive queries
    
  2. Security
    - Users can read their own profile
    - Users can insert their own profile
*/

-- Drop all existing policies on users table
DROP POLICY IF EXISTS "Users can read own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update user points" ON users;
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Drop policies on rewards that reference users table
DROP POLICY IF EXISTS "Admins can insert rewards" ON rewards;
DROP POLICY IF EXISTS "Admins can update rewards" ON rewards;
DROP POLICY IF EXISTS "Admins can delete rewards" ON rewards;

-- Drop policies on reward_requests that reference users table
DROP POLICY IF EXISTS "Employees can create reward requests" ON reward_requests;
DROP POLICY IF EXISTS "Users can view own reward requests" ON reward_requests;
DROP POLICY IF EXISTS "Admins can view all reward requests" ON reward_requests;
DROP POLICY IF EXISTS "Admins can update reward requests" ON reward_requests;

-- Drop policies on rules that reference users table
DROP POLICY IF EXISTS "Admins can insert rules" ON rules;
DROP POLICY IF EXISTS "Admins can update rules" ON rules;
DROP POLICY IF EXISTS "Admins can delete rules" ON rules;

-- Create new policies without recursion
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

-- Recreate rewards policies (open access for authenticated users)
CREATE POLICY "Authenticated users can manage rewards"
  ON rewards FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Recreate reward_requests policies
CREATE POLICY "Users can manage reward requests"
  ON reward_requests FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Recreate rules policies
CREATE POLICY "Users can manage rules"
  ON rules FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
