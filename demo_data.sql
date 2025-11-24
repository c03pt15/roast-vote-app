-- Insert demo posts linked to the most recently created user
-- Run this in the Supabase SQL Editor

DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- 1. Get the most recent user ID
    SELECT id INTO target_user_id FROM auth.users ORDER BY created_at DESC LIMIT 1;

    IF target_user_id IS NULL THEN
        RAISE EXCEPTION 'No users found in auth.users. Please sign up first.';
    END IF;

    -- 2. Ensure a profile exists for this user
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (
        target_user_id, 
        'demo_user', 
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
    )
    ON CONFLICT (id) DO NOTHING;

    -- 3. Insert the demo posts
    INSERT INTO public.posts (user_id, image_url, caption, type)
    SELECT 
        target_user_id, 
        image_url, 
        caption, 
        type 
    FROM (VALUES 
        ('https://images.unsplash.com/photo-1517849845537-4d257902454a?w=800&q=80', 'Rate my new haircut! 🐶', 'vote'),
        ('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80', 'Roast my setup... be gentle (or not)', 'roast'),
        ('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Is this outfit cringe? 1-10', 'vote'),
        ('https://images.unsplash.com/photo-1496345875659-11f7dd282d1d?w=800&q=80', 'Trying to be aesthetic. Roast me.', 'roast'),
        ('https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80', 'Homemade pizza. Thoughts?', 'vote'),
        ('https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', 'Fashion expert or fashion disaster?', 'roast')
    ) AS data(image_url, caption, type);

END $$;
