# Database Migration Instructions - MANDATORY NICKNAME UPDATE

To add the **mandatory nickname feature** to your Kingdom Guard application, you need to run the updated SQL in your Supabase database.

⚠️ **IMPORTANT**: Nickname is now **MANDATORY** for all users!

## How to apply the migration:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/projects
2. Navigate to the SQL Editor
3. Copy and paste the SQL from `supabase/migrations/add_user_profiles.sql`
4. Click "Run" to execute the migration

## What this migration does:

- Creates a `user_profiles` table with **nickname as NOT NULL** (mandatory)
- Sets up Row Level Security so users can only access their own profile
- **Note**: No automatic profile creation - users must set their nickname manually

## After applying the migration:

1. The changes should automatically deploy to Vercel from GitHub
2. **Test the new mandatory nickname flow**

## New User Experience:

### **Sign Up Flow:**
- ✅ **Email field** (required)
- ✅ **Nickname field** (required, new!)
- ✅ **Password field** (required)
- New users must provide a nickname during registration

### **Existing Users:**
- ✅ **Mandatory Setup Screen**: Users without a nickname will see a setup screen
- ✅ **Cannot skip**: Must set a nickname to continue using the app
- ✅ **One-time setup**: Once set, they can use the app normally

### **Profile Management:**
- ✅ **Always Visible**: Nickname always displayed in navbar (since it's mandatory)
- ✅ **Profile Button**: Purple "Profile" button to edit nickname
- ✅ **Required Field**: Cannot save empty nickname in profile dialog

## Features added:

- **Mandatory nickname** for all users (new and existing)
- **Sign-up form** now includes required nickname field
- **NicknameSetup component** for existing users without nickname
- **Enhanced Profile dialog** with required nickname validation
- **Always visible nickname** in navbar between Save button and email

## Testing Steps:

1. **New User**: Try signing up - should require nickname
2. **Existing User**: Login should show nickname setup screen if no nickname exists
3. **Profile Edit**: Click "Profile" button - nickname should be required field
4. **Navbar Display**: Nickname should always be visible once set
