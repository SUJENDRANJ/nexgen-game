/*
  # Create rules table for gamification

  1. New Tables
    - `rules`
      - `id` (uuid, primary key) - Unique identifier for each rule
      - `title` (text, not null) - Title of the rule
      - `description` (text, not null) - Description of what the rule entails
      - `points` (integer, not null) - Point value for the rule
      - `created_at` (timestamptz) - Timestamp when rule was created
      - `created_by` (uuid, foreign key) - References the admin who created it

  2. Security
    - Enable RLS on `rules` table
    - Admins can insert, update, and delete rules
    - All authenticated users can view rules

  3. Important Notes
    - Rules are managed exclusively by admins
    - Employees have read-only access to view rules
    - Foreign key ensures data integrity with users table
*/

CREATE TABLE IF NOT EXISTS rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  points integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES users(id)
);

ALTER TABLE rules ENABLE ROW LEVEL SECURITY;

-- Admins can perform all operations on rules
CREATE POLICY "Admins can insert rules"
  ON rules
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can update rules"
  ON rules
  FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

CREATE POLICY "Admins can delete rules"
  ON rules
  FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE email = auth.jwt()->>'email') = 'admin');

-- All authenticated users can view rules
CREATE POLICY "All authenticated users can view rules"
  ON rules
  FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample rules
INSERT INTO rules (title, description, points) VALUES
  ('Early Arrival', 'Arrive at office before 8 AM', 10),
  ('Help a Colleague', 'Assist a team member with their task', 15),
  ('Complete Project Early', 'Finish assigned project ahead of deadline', 50),
  ('Perfect Attendance', 'No absences for a full month', 100),
  ('Organize Team Event', 'Plan and execute a team building activity', 75)
ON CONFLICT DO NOTHING;
