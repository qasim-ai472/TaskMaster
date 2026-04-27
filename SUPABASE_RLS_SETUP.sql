-- ============================================================
-- SUPABASE RLS POLICIES FOR MESSAGES TABLE
-- ============================================================
-- Run this in Supabase SQL Editor to set up Row Level Security

-- Step 1: Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Step 2: CREATE POLICY - Users can SELECT their own messages
CREATE POLICY "Users can view their own messages"
ON messages
FOR SELECT
USING (
  auth.uid() = sender_id OR auth.uid() = recipient_id
);

-- Step 3: CREATE POLICY - Users can INSERT their own messages
CREATE POLICY "Users can send messages"
ON messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
);

-- Step 4: CREATE POLICY - Admins can SELECT all messages (for admin dashboard)
-- This allows admins to see all messages in the system
CREATE POLICY "Admins can view all messages"
ON messages
FOR SELECT
USING (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- Step 5: CREATE POLICY - Admins can INSERT messages to users
CREATE POLICY "Admins can send messages"
ON messages
FOR INSERT
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  AND auth.uid() = sender_id
);

-- ============================================================
-- VERIFICATION QUERIES (Optional - run to verify setup)
-- ============================================================

-- Check if RLS is enabled:
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'messages';

-- Check all policies on messages table:
-- SELECT * FROM pg_policies WHERE tablename = 'messages';
