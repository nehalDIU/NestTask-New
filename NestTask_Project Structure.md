NestTask - university-task-management/
│
├── 📄 package.json
├── 📄 tsconfig.json
├── 📄 tailwind.config.ts
├── 📄 postcss.config.js
├── 📄 next.config.mjs           # SEO, images, redirects, etc.
├── 📄 .env.local                # Supabase keys (never commit)
├── 📄 .gitignore
│
├── 📂 supabase
│   ├── schema.sql               # Database schema
│   ├── seeds.sql                # Initial data (departments, batches, sections)
│   └── policies.sql             # RLS policies
│
├── 📂 public                    # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── og-image.png             # For social previews
│
├── 📂 src
│   ├── 📂 app                   # Next.js App Router
│   │   ├── layout.tsx           # Root HTML & head structure
│   │   ├── page.tsx             # Landing / Marketing page
│   │   ├── sitemap.ts           # SEO sitemap
│   │   ├── robots.txt           # SEO rules
│   │   │
│   │   ├── (auth)               # Route group for authentication
│   │   │   ├── signup
│   │   │   │   └── page.tsx
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx       # Shared layout for auth pages
│   │   │
│   │   ├── (dashboard)          # Route group for protected dashboards
│   │   │   ├── layout.tsx       # Sidebar + top nav layout
│   │   │   ├── student
│   │   │   │   └── page.tsx
│   │   │   ├── section-admin
│   │   │   │   └── page.tsx
│   │   │   └── super-admin
│   │   │       └── page.tsx
│   │   │
│   │   ├── tasks                # SEO-friendly task routes
│   │   │   ├── page.tsx         # Task list (default)
│   │   │   ├── create
│   │   │   │   └── page.tsx
│   │   │   ├── [taskId]         # Dynamic route for SEO: /tasks/123-task-title
│   │   │   │   └── page.tsx
│   │   │   └── edit
│   │   │       └── [taskId]
│   │   │           └── page.tsx
│   │   │
│   │   ├── api                  # Server API routes
│   │   │   ├── auth
│   │   │   │   ├── signup/route.ts
│   │   │   │   ├── login/route.ts
│   │   │   │   └── logout/route.ts
│   │   │   ├── tasks
│   │   │   │   ├── create/route.ts
│   │   │   │   ├── update/route.ts
│   │   │   │   └── delete/route.ts
│   │   │   └── users
│   │   │       ├── update-role/route.ts
│   │   │       └── delete/route.ts
│   │   │
│   │   └── middleware.ts        # Role-based route protection
│   │
│   ├── 📂 components            # UI components
│   │   ├── ui                   # Low-level UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth                 # Auth-specific components
│   │   │   ├── SignupForm.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   └── PasswordResetForm.tsx
│   │   ├── dashboard            # Dashboard widgets
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Navbar.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   ├── CalendarView.tsx
│   │   │   └── AnalyticsChart.tsx
│   │   └── seo                   # SEO components
│   │       └── MetaTags.tsx
│   │
│   ├── 📂 lib                   # Helpers & configs
│   │   ├── supabase.ts          # Supabase SSR client
│   │   ├── auth.ts              # Auth utilities
│   │   ├── validators.ts        # Zod validation schemas
│   │   ├── constants.ts         # Role names, enums, etc.
│   │   ├── fetchers.ts          # Supabase queries
│   │   └── seo.ts               # Metadata generator functions
│   │
│   ├── 📂 hooks
│   │   ├── useAuth.ts
│   │   ├── useTasks.ts
│   │   └── useRole.ts
│   │
│   ├── 📂 context
│   │   └── AuthProvider.tsx
│   │
│   └── 📂 types
│       ├── database.ts          # Supabase-generated types
│       ├── auth.ts
│       └── task.ts
│
└── Project Structure.md
