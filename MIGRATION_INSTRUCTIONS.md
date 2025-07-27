# Database Migration Instructions

To add the nickname feature to your Kingdom Guard application, you need to run the following SQL in your Supabase database.

## How to apply the migration:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/projects
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/migrations/add_user_profiles.sql`
4. Click "Run" to execute the migration

## What this migration does:

- Creates a `user_profiles` table to store additional user information (like nickname)
- Sets up Row Level Security so users can only access their own profile
- Creates a trigger to automatically create a profile when a user signs up
- Existing users will get a profile created when they first try to update their nickname

## After applying the migration:

1. Commit your code changes to GitHub:
   ```
   git add .
   git commit -m "Add nickname feature to user profiles"
   git push
   ```

2. The changes will automatically deploy to Vercel

## Features added:

- Users can now set a nickname in their profile
- The nickname appears in the navbar between the Save button and email
- Profile dialog accessible via "Profile" button in the navbar
- Nickname is optional and can be left blank
