/*
  # Add user insert policy

  1. Changes
    - Add policy to allow users to insert their own profile during signup
    
  2. Security
    - Users can only insert a profile for their own auth.uid()
    - Prevents users from creating profiles for other users
*/

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());
