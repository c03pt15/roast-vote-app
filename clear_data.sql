-- Clear all posts (and associated votes/comments)
-- Run this in the Supabase SQL Editor to reset the feed

TRUNCATE TABLE public.posts CASCADE;

-- Note: This will delete ALL posts, votes, and comments.
-- It does not delete users or profiles.
