# NestTask - University Task Management System

A comprehensive task management system built specifically for university environments, featuring role-based access control, real-time updates, and academic hierarchy management.

## 🎯 Features

### 🔐 Multi-Role Authentication
- **Students**: View and complete section tasks
- **Section Admins**: Create and manage tasks for their section
- **Super Admins**: Full system management and analytics

### 🏛️ Academic Hierarchy
- **5 Departments**: CSE, SWE, MCT, CIS, ITM
- **21 Batches per Department**: Batch 50-70
- **26 Sections per Batch**: Section A-Z

### 📋 Task Management
- Create, assign, and track tasks with due dates
- File attachments and categories
- Real-time status updates
- Progress tracking and analytics

### 🛡️ Security & Performance
- Row Level Security (RLS) policies
- Role-based route protection
- Real-time subscriptions
- Optimized database queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install
```bash
git clone <repository-url>
cd NestTask
npm install
```

### 2. Environment Setup
Copy `.env.local` and update with your Supabase credentials:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME="NestTask - University Task Management"
```

### 3. Database Setup
The database schema and seed data are already created in your Supabase project:
- 5 departments with 21 batches each
- 26 sections per batch
- Proper RLS policies configured

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📁 Project Structure

```
NestTask/
├── 📂 src/
│   ├── 📂 app/                 # Next.js App Router
│   │   ├── (auth)/            # Authentication pages
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── tasks/             # Task management pages
│   │   └── api/               # API routes
│   ├── 📂 components/         # Reusable components
│   │   ├── ui/                # Base UI components
│   │   ├── auth/              # Authentication forms
│   │   └── dashboard/         # Dashboard widgets
│   ├── 📂 lib/                # Utilities and configurations
│   ├── 📂 hooks/              # Custom React hooks
│   ├── 📂 context/            # React contexts
│   └── 📂 types/              # TypeScript definitions
├── 📂 supabase/               # Database schema and migrations
└── 📂 public/                 # Static assets
```

## 🔧 Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Validation**: Zod
- **Real-time**: Supabase Realtime

## 👥 User Roles & Permissions

### Student (`user`)
- ✅ View section tasks
- ✅ Mark tasks as complete
- ✅ View personal progress
- ❌ Create/edit/delete tasks

### Section Admin (`section_admin`)
- ✅ All student permissions
- ✅ Create tasks for their section
- ✅ Edit/delete their tasks
- ✅ View section analytics
- ✅ Manage section members

### Super Admin (`super_admin`)
- ✅ All permissions
- ✅ Manage all users and roles
- ✅ System-wide analytics
- ✅ Manage departments/batches/sections

## 🗄️ Database Schema

### Core Tables
- `departments` - Academic departments
- `batches` - Student batches within departments
- `sections` - Sections within batches
- `users` - User accounts with role-based access
- `tasks` - Task assignments
- `user_tasks` - Individual task completion tracking

### Key Features
- Foreign key relationships
- Email domain validation (`@diu.edu.bd`)
- Comprehensive indexing
- Row Level Security policies

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Email domain restriction
- Session management
- Password reset functionality

### Authorization
- Role-based access control
- Row Level Security policies
- Route protection middleware
- API endpoint protection

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS responsive utilities
- Optimized for all screen sizes
- Touch-friendly interface

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Manual Deployment
```bash
npm run build
npm start
```

## 🧪 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Zod for runtime validation

## 📊 Features Overview

### Real-time Updates
- Live task status changes
- Instant notifications
- Collaborative editing
- Real-time analytics

### Analytics & Reporting
- Task completion rates
- User progress tracking
- Section performance metrics
- System-wide statistics

### File Management
- Task file attachments
- Multiple file formats supported
- Secure file storage
- File size limitations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

Built with ❤️ for Daffodil International University
