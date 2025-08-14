-- NestTask Row Level Security Policies
-- Enable RLS and create security policies for all tables

-- Enable Row Level Security on all tables
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_tasks ENABLE ROW LEVEL SECURITY;

-- Departments policies (readable by all authenticated users, writable by super_admin only)
CREATE POLICY "Departments are viewable by authenticated users" ON departments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Departments are manageable by super_admin" ON departments
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

-- Batches policies
CREATE POLICY "Batches are viewable by authenticated users" ON batches
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Batches are manageable by super_admin" ON batches
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

-- Sections policies
CREATE POLICY "Sections are viewable by authenticated users" ON sections
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Sections are manageable by super_admin" ON sections
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'super_admin'
        )
    );

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Section admins can view users in their section" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'section_admin'
            AND admin_user.section_id = users.section_id
        )
    );

CREATE POLICY "Super admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'super_admin'
        )
    );

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Section admins can manage users in their section" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'section_admin'
            AND admin_user.section_id = users.section_id
        )
    );

CREATE POLICY "Super admins can manage all users" ON users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users admin_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'super_admin'
        )
    );

-- Tasks policies
CREATE POLICY "Users can view tasks in their section" ON tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.section_id = tasks.section_id
        )
    );

CREATE POLICY "Section admins can manage tasks in their section" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role IN ('section_admin', 'super_admin')
            AND (users.section_id = tasks.section_id OR users.role = 'super_admin')
        )
    );

CREATE POLICY "Super admins can manage all tasks" ON tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
        )
    );

-- User tasks policies
CREATE POLICY "Users can view their own task completions" ON user_tasks
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own task completions" ON user_tasks
    FOR UPDATE USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert their own task completions" ON user_tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Section admins can view task completions in their section" ON user_tasks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users admin_user, tasks, users task_user
            WHERE admin_user.id = auth.uid()
            AND admin_user.role = 'section_admin'
            AND tasks.id = user_tasks.task_id
            AND task_user.id = user_tasks.user_id
            AND admin_user.section_id = task_user.section_id
        )
    );

CREATE POLICY "Super admins can manage all task completions" ON user_tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND users.role = 'super_admin'
        )
    );
