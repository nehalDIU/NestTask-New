---
type: "always_apply"
---

# NestTask - University Task Management System

### **PART 1 — Supabase Database Schema**

**Hierarchy:**

* Departments → Batches → Sections
* Departments (5 total):

  * Computer Science and Engineering (CSE)
  * Software Engineering (SWE)
  * Multimedia and Creative Technology (MCT)
  * Computing and Information Systems (CIS)
  * Information Technology and Management (ITM)
* Each department has **21 batches**: "Batch 50" → "Batch 70"
* Each batch has **26 sections**: "Section A" → "Section Z"

**Tables:**

1. `departments` (id, name, created\_at)
2. `batches` (id, name, department\_id, created\_at)
3. `sections` (id, name, batch\_id, created\_at)
4. `users` (id, email, name, role, student\_id, department\_id, batch\_id, section\_id, created\_at)
5. `tasks` (id, title, description, files, due\_date, category, status, section\_id, created\_by, created\_at)

**Database Requirements:**

* Foreign key relationships between tables
* Email domain validation constraint: only `@diu.edu.bd` allowed in `users.email`
* Proper indexes for performance
* **Seed data:** Pre-populate all departments, batches, and sections

---

### **PART 2 — Authentication System**

**Features:**

* Multi-step signup form: select department → batch → section
* Email validation for `@diu.edu.bd`
* Roles: `user`, `section_admin`, `super_admin`
* Login & logout
* Password reset
* Remember me checkbox
* Middleware-protected routes
* Session management with Supabase Auth
* Automatic profile creation upon signup

**Tech Requirements:**

* Use `@supabase/ssr` for Next.js 15 App Router
* Server Actions for form handling
* Reusable authentication components
* Authentication context provider (`AuthProvider.tsx`)
* Middleware (`middleware.ts`) for role-based route protection
* Strong validation & error handling

**Auth Components to Implement:**

1. `SignupForm.tsx` — multi-step signup form with dropdowns for department, batch, section
2. `LoginForm.tsx` — login interface
3. `AuthProvider.tsx` — context for auth state management
4. `ProtectedRoute.tsx` — wrapper for role-protected components
5. `auth/actions.ts` — server actions for signup/login/logout/reset

---

### **PART 3 — Role-Based Dashboards**

**Student Dashboard:**

* View section-specific tasks
* Mark tasks as complete
* Personal profile management
* Calendar view for upcoming tasks
* **Restriction:** Student cannot delete/edit section tasks

**Section Admin Dashboard:**

* Task management (CRUD for their section only)
* Routine management (create/edit schedules)
* Manage section members (view, delete, promote to admin)
* Task analytics & progress tracking
* Bulk task operations
* Real-time updates via Supabase subscriptions

**Super Admin Dashboard:**

* Full system user management
* CRUD for departments, batches, sections
* Cross-section task management
* Assign roles
* System-wide analytics & reporting
* Audit logs of all actions

---

### **PART 4 — Technical Implementation**

* **Framework:** Next.js 15 (App Router) with TypeScript
* **Database & Auth:** Supabase (PostgreSQL)
* **Styling:** Tailwind CSS (fully responsive)
* **Data Fetching:** Supabase real-time subscriptions for live updates
* **Components:** Fully reusable CRUD and form components with loading & error states
* **Validation:** Zod or similar for strong form validation with error messages
* **Performance:** Indexed DB queries and optimized fetching
* **Security:** Row-level security (RLS) in Supabase for role-based access

---

### **PART 5 — Deliverables**

The final AI output must include:

1. **Supabase SQL Schema**: All tables, constraints, indexes, and seed data for departments, batches, and sections.
2. **Next.js 15 Project Folder Structure**: With all pages, components, hooks, and utilities organized.
3. **Authentication System Code**: With all components, server actions, and middleware.
4. **Role-Based Dashboards**: Student, Section Admin, and Super Admin dashboards with their respective features.
5. **Real-Time Features**: Supabase subscriptions for live task updates.
6. **Responsive Design**: Fully styled with Tailwind for mobile and desktop.
7. **Error Handling**: Friendly validation and error messages.

**Important:**

* Output must be **complete, functional, and ready to run**.
* Include **TypeScript types for all entities**.
* Include **example `.env.local` setup** for Supabase keys.
* Follow **best practices** in code structure and security.

---

**Now generate the full project code in sequence, starting with:**

1. SQL schema & seed data
2. Next.js 15 folder structure with Supabase config
3. Authentication system
4. Dashboards with role-based logic
5. Any helper utilities/hooks

---
