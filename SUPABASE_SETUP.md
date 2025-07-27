# Supabase Database Setup

This document contains the SQL commands needed to set up your Supabase database for the Kingdom Guard application.

## Prerequisites

1. Create a new Supabase project at [https://supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Run the following SQL commands in the Supabase SQL Editor

## Database Tables

### 1. Create bag_items table

```sql
-- Create bag_items table
CREATE TABLE IF NOT EXISTS public.bag_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  item_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, item_name)
);

-- Create updated_at trigger for bag_items
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_bag_items_updated_at
  BEFORE UPDATE ON public.bag_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### 2. Create mk_points table

```sql
-- Create mk_points table
CREATE TABLE IF NOT EXISTS public.mk_points (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day TEXT NOT NULL,
  item_name TEXT NOT NULL,
  points_per_unit INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, day, item_name)
);

-- Create updated_at trigger for mk_points
CREATE TRIGGER handle_mk_points_updated_at
  BEFORE UPDATE ON public.mk_points
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

### 3. Create mk_seasons_data table

```sql
-- Create mk_seasons_data table
CREATE TABLE IF NOT EXISTS public.mk_seasons_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  item_name TEXT NOT NULL UNIQUE,
  season_values INTEGER[] NOT NULL DEFAULT '{}',
  season_quantities INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger for mk_seasons_data
CREATE TRIGGER handle_mk_seasons_data_updated_at
  BEFORE UPDATE ON public.mk_seasons_data
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
```

## Row Level Security (RLS)

### 1. Enable RLS and create policies for bag_items

```sql
-- Enable RLS on bag_items
ALTER TABLE public.bag_items ENABLE ROW LEVEL SECURITY;

-- Create policy for bag_items - users can only access their own data
CREATE POLICY "Users can view their own bag items" ON public.bag_items
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bag items" ON public.bag_items
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bag items" ON public.bag_items
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bag items" ON public.bag_items
  FOR DELETE USING (auth.uid() = user_id);
```

### 2. Enable RLS and create policies for mk_points

```sql
-- Enable RLS on mk_points
ALTER TABLE public.mk_points ENABLE ROW LEVEL SECURITY;

-- Create policy for mk_points - users can only access their own data
CREATE POLICY "Users can view their own mk points" ON public.mk_points
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mk points" ON public.mk_points
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mk points" ON public.mk_points
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mk points" ON public.mk_points
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Enable RLS and create policies for mk_seasons_data (Public read access)

```sql
-- Enable RLS on mk_seasons_data
ALTER TABLE public.mk_seasons_data ENABLE ROW LEVEL SECURITY;

-- Create policy for mk_seasons_data - public read access, admin write access
CREATE POLICY "Anyone can read mk seasons data" ON public.mk_seasons_data
  FOR SELECT USING (true);

-- Only authenticated users can modify (you can restrict this further if needed)
CREATE POLICY "Authenticated users can manage mk seasons data" ON public.mk_seasons_data
  FOR ALL USING (auth.role() = 'authenticated');
```

## Indexes for Performance

```sql
-- Create indexes for better performance
CREATE INDEX idx_bag_items_user_id ON public.bag_items(user_id);
CREATE INDEX idx_bag_items_user_item ON public.bag_items(user_id, item_name);

CREATE INDEX idx_mk_points_user_id ON public.mk_points(user_id);
CREATE INDEX idx_mk_points_user_day ON public.mk_points(user_id, day);

CREATE INDEX idx_mk_seasons_data_item_name ON public.mk_seasons_data(item_name);
```

## Real-time Subscriptions (Optional)

If you want real-time updates, enable real-time for the tables:

```sql
-- Enable real-time for bag_items
ALTER PUBLICATION supabase_realtime ADD TABLE public.bag_items;

-- Enable real-time for mk_points
ALTER PUBLICATION supabase_realtime ADD TABLE public.mk_points;

-- Enable real-time for mk_seasons_data
ALTER PUBLICATION supabase_realtime ADD TABLE public.mk_seasons_data;
```

## Environment Variables

After setting up your Supabase project, update your `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

You can find these values in your Supabase project settings under "API".

## Authentication Setup

The application uses Supabase Auth with email/password. No additional setup is required as this is enabled by default in Supabase projects.

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3001`
3. Create a new account or sign in
4. Test the bag and MK pages to ensure data is being saved and loaded correctly
