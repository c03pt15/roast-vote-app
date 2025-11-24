-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  username text unique,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS) for profiles
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a table for posts
create table posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  image_url text not null,
  caption text,
  type text check (type in ('roast', 'vote')) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table posts enable row level security;

create policy "Posts are viewable by everyone." on posts
  for select using (true);

create policy "Authenticated users can create posts." on posts
  for insert with check (auth.uid() = user_id);

-- Create a table for votes
create table votes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  post_id uuid references posts(id) on delete cascade not null,
  rating integer check (rating >= 1 and rating <= 10) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

alter table votes enable row level security;

create policy "Votes are viewable by everyone." on votes
  for select using (true);

create policy "Authenticated users can vote." on votes
  for insert with check (auth.uid() = user_id);

-- Create a table for comments (roasts)
create table comments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references profiles(id) not null,
  post_id uuid references posts(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table comments enable row level security;

create policy "Comments are viewable by everyone." on comments
  for select using (true);

create policy "Authenticated users can comment." on comments
  for insert with check (auth.uid() = user_id);

-- Storage Bucket Policy (You need to create a bucket named 'posts' in the dashboard)
-- This SQL assumes the bucket exists. If not, create it in the Supabase Dashboard > Storage.
-- Policy to allow public access to 'posts' bucket
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'posts' );
-- Policy to allow authenticated uploads
-- create policy "Authenticated Uploads" on storage.objects for insert with check ( bucket_id = 'posts' and auth.role() = 'authenticated' );
