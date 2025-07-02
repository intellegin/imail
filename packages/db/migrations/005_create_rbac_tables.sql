-- Create roles table
CREATE TABLE roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    is_system_role BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create permissions table
CREATE TABLE permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(50) NOT NULL,
    action VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles junction table
CREATE TABLE user_roles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    assigned_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, role_id)
);

-- Create role_permissions junction table
CREATE TABLE role_permissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(role_id, permission_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX idx_permissions_resource_action ON permissions(resource, action);

-- Enable RLS
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (adjust based on your needs)
CREATE POLICY "Users can view roles" ON roles FOR SELECT USING (true);
CREATE POLICY "Users can view permissions" ON permissions FOR SELECT USING (true);
CREATE POLICY "Users can view user roles" ON user_roles FOR SELECT USING (true);
CREATE POLICY "Users can view role permissions" ON role_permissions FOR SELECT USING (true);

-- Insert default roles
INSERT INTO roles (name, description, is_system_role) VALUES
    ('Admin', 'Full system access and platform management', true),
    ('Coach', 'Can manage students and content', true),
    ('Student', 'Access to learning materials and own profile', true);

-- Insert default permissions
INSERT INTO permissions (name, resource, action, description) VALUES
    -- User management
    ('users:read', 'users', 'read', 'View users'),
    ('users:write', 'users', 'write', 'Create/update users'),
    ('users:delete', 'users', 'delete', 'Delete users'),
    ('profile:read', 'profile', 'read', 'View own profile'),
    ('profile:write', 'profile', 'write', 'Update own profile'),
    
    -- Role and permission management
    ('roles:read', 'roles', 'read', 'View roles'),
    ('roles:write', 'roles', 'write', 'Create/update roles'),
    ('roles:delete', 'roles', 'delete', 'Delete roles'),
    ('permissions:read', 'permissions', 'read', 'View permissions'),
    ('permissions:write', 'permissions', 'write', 'Create/update permissions'),
    
    -- Course/Content management
    ('courses:read', 'courses', 'read', 'View courses'),
    ('courses:write', 'courses', 'write', 'Create/update courses'),
    ('courses:delete', 'courses', 'delete', 'Delete courses'),
    ('content:read', 'content', 'read', 'View learning content'),
    ('content:write', 'content', 'write', 'Create/update content'),
    
    -- Student management (for coaches)
    ('students:read', 'students', 'read', 'View student information'),
    ('students:write', 'students', 'write', 'Update student information'),
    ('students:assign', 'students', 'assign', 'Assign students to courses'),
    
    -- Analytics and reporting
    ('analytics:read', 'analytics', 'read', 'View analytics and reports'),
    ('reports:read', 'reports', 'read', 'View reports'),
    ('reports:write', 'reports', 'write', 'Create/update reports');

-- Assign permissions to roles
WITH role_perm_mapping AS (
    SELECT 
        r.id as role_id,
        p.id as permission_id
    FROM roles r
    CROSS JOIN permissions p
    WHERE 
        -- Admin gets all permissions
        (r.name = 'Admin') OR
        
        -- Coach gets most permissions except system admin functions
        (r.name = 'Coach' AND p.name IN (
            'users:read', 'users:write',
            'profile:read', 'profile:write',
            'roles:read', 'permissions:read',
            'courses:read', 'courses:write', 'courses:delete',
            'content:read', 'content:write',
            'students:read', 'students:write', 'students:assign',
            'analytics:read', 'reports:read', 'reports:write'
        )) OR
        
        -- Student gets limited permissions
        (r.name = 'Student' AND p.name IN (
            'profile:read', 'profile:write',
            'courses:read', 'content:read',
            'reports:read'
        ))
)
INSERT INTO role_permissions (role_id, permission_id)
SELECT role_id, permission_id FROM role_perm_mapping; 