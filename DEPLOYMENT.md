# Deployment Guide

## Quick Deployment Checklist

✅ **Prerequisites**
- [ ] Supabase project created
- [ ] Database tables created (see SUPABASE_SETUP.md)
- [ ] Environment variables configured
- [ ] Code pushed to GitHub repository

## Step-by-Step Deployment

### 1. Supabase Setup

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and project name
   - Wait for the project to be created

2. **Set up Database Tables**
   - Follow all instructions in `SUPABASE_SETUP.md`
   - Run all SQL commands in the Supabase SQL Editor
   - Verify tables are created with proper RLS policies

3. **Get API Keys**
   - Go to Project Settings → API
   - Copy your Project URL and anon public key

### 2. Local Environment Setup

1. **Update Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
2. **Add your Supabase credentials to `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Test Locally**
   ```bash
   npm run dev
   ```
   - Verify authentication works
   - Test bag and MK pages
   - Ensure data saves correctly

### 3. Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel dashboard, go to Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be live at `https://your-app.vercel.app`

### 4. Alternative Deployment Options

#### Netlify

1. **Build Configuration**
   ```toml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"
   ```

2. **Environment Variables**
   - In Netlify dashboard: Site Settings → Environment Variables
   - Add your Supabase credentials

#### Railway

1. **Connect GitHub Repository**
2. **Add Environment Variables** in Railway dashboard
3. **Deploy** - Railway will handle the build automatically

#### DigitalOcean App Platform

1. **Create App** from GitHub repository
2. **Configure Build Settings**:
   - Build Command: `npm run build`
   - Run Command: `npm start`
3. **Add Environment Variables**

## Post-Deployment

### 1. Verify Deployment

- [ ] App loads without errors
- [ ] Authentication works (signup/login)
- [ ] Bag page loads and saves data
- [ ] MK page calculates correctly
- [ ] Real-time updates work (if enabled)

### 2. Configure Domain (Optional)

1. **Custom Domain**
   - In Vercel: Settings → Domains
   - Add your custom domain
   - Configure DNS records

2. **SSL Certificate**
   - Vercel automatically provides SSL
   - For other platforms, ensure HTTPS is enabled

### 3. Monitoring

1. **Error Tracking**
   - Consider adding Sentry for error monitoring
   - Monitor Vercel/Netlify build logs

2. **Performance**
   - Use Vercel Analytics or Google Analytics
   - Monitor Core Web Vitals

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loading**
   - Ensure variables are set in deployment platform
   - Redeploy after adding variables
   - Check variable names match exactly

2. **Supabase Connection Failed**
   - Verify Supabase URL and key are correct
   - Check if Supabase project is active
   - Ensure RLS policies are set up correctly

3. **Build Failures**
   - Check build logs for specific errors
   - Ensure all dependencies are listed in package.json
   - Verify TypeScript errors are resolved

4. **Authentication Issues**
   - Check Supabase Auth settings
   - Verify site URL in Supabase dashboard
   - Ensure redirect URLs are configured

### Getting Help

1. **Check Logs**
   - Vercel: Function logs in dashboard
   - Supabase: Logs & Extensions → Logs Explorer

2. **Resources**
   - [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
   - [Supabase Documentation](https://supabase.com/docs)
   - [Vercel Documentation](https://vercel.com/docs)

## Production Optimization

### 1. Performance

- Consider implementing React Suspense
- Add loading skeletons
- Optimize images with Next.js Image component
- Enable caching for static assets

### 2. Security

- Review and test RLS policies
- Implement rate limiting if needed
- Monitor for suspicious activity
- Keep dependencies updated

### 3. Backup

- Set up Supabase database backups
- Consider data export functionality
- Document recovery procedures
