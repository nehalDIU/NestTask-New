# NestTask Setup Guide

This guide will help you set up the NestTask University Task Management System from scratch.

## 📋 Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm or yarn package manager
- A Supabase account (free tier is sufficient)
- Git installed on your system

## 🗄️ Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `nest-task-management`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your location

### 2. Get Project Credentials
Once your project is ready:
1. Go to Project Settings → API
2. Copy the following values:
   - Project URL
   - Anon (public) key
   - Service role key (keep this secret!)

### 3. Database Schema
The database schema is already created via the Supabase Management API. It includes:
- All required tables with proper relationships
- Row Level Security policies
- Seed data for departments, batches, and sections

## 💻 Local Development Setup

### 1. Clone Repository
```bash
git clone <your-repository-url>
cd NestTask
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Copy the `.env.local` file and update with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="NestTask - University Task Management"

# Optional: Email Configuration (for future use)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 4. Verify Database Setup
The database should already be set up with:
- ✅ 5 departments (CSE, SWE, MCT, CIS, ITM)
- ✅ 21 batches per department (Batch 50-70)
- ✅ 26 sections per batch (Section A-Z)
- ✅ All RLS policies configured

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application running.

## 🧪 Testing the Setup

### 1. Create Test Accounts
1. Go to `/signup`
2. Create accounts with different roles:
   - Student: `student@diu.edu.bd`
   - Section Admin: `admin@diu.edu.bd`
   - Super Admin: (manually update role in database)

### 2. Test Authentication
- ✅ Sign up with @diu.edu.bd email
- ✅ Sign in with created account
- ✅ Password reset functionality
- ✅ Role-based redirects

### 3. Test Role-Based Access
- ✅ Student can view tasks
- ✅ Section Admin can create tasks
- ✅ Super Admin can access all features

### 4. Test Real-time Features
- ✅ Create a task as Section Admin
- ✅ Mark task as complete as Student
- ✅ Verify real-time updates

## 🚀 Production Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository

2. **Configure Environment Variables**
   Add all environment variables from `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   NEXT_PUBLIC_APP_URL (set to your domain)
   ```

3. **Deploy**
   - Vercel will automatically build and deploy
   - Update `NEXT_PUBLIC_APP_URL` to your production domain

### Manual Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 🔧 Configuration Options

### Email Domain Restriction
By default, only `@diu.edu.bd` emails are allowed. To change this:
1. Update the constraint in `supabase/schema.sql`
2. Update validation in `src/lib/validators.ts`

### Role Management
To promote users to admin roles:
1. Go to Supabase Dashboard → Table Editor → users
2. Update the `role` field for specific users
3. Available roles: `user`, `section_admin`, `super_admin`

### Customization
- **Branding**: Update colors in `tailwind.config.ts`
- **Logo**: Replace files in `public/` directory
- **Content**: Update text in components and pages

## 🛠️ Troubleshooting

### Common Issues

**1. Database Connection Error**
- Verify Supabase URL and keys
- Check if project is active
- Ensure RLS policies are enabled

**2. Authentication Issues**
- Verify email domain restriction
- Check Supabase Auth settings
- Ensure proper environment variables

**3. Permission Errors**
- Verify user roles in database
- Check RLS policies
- Ensure proper middleware configuration

**4. Real-time Not Working**
- Check Supabase Realtime is enabled
- Verify subscription setup
- Check browser console for errors

### Getting Help

1. **Check Logs**
   - Browser console for client errors
   - Supabase logs for database issues
   - Vercel logs for deployment issues

2. **Verify Setup**
   - Run `npm run type-check`
   - Check all environment variables
   - Verify database schema

3. **Contact Support**
   - Create GitHub issue
   - Check documentation
   - Contact development team

## 📊 Monitoring & Maintenance

### Performance Monitoring
- Monitor Supabase usage in dashboard
- Check Vercel analytics
- Monitor real-time connections

### Database Maintenance
- Regular backups via Supabase
- Monitor storage usage
- Review and optimize queries

### Security Updates
- Keep dependencies updated
- Monitor Supabase security advisories
- Regular security audits

---

🎉 **Congratulations!** Your NestTask system should now be fully operational.

For additional help, refer to the main README.md or create an issue in the repository.
