-- Check if the users table exists, if not create it
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create initial admin user if it doesn't exist
-- Password is 'admin' hashed with SHA-256
INSERT INTO users (email, password, role)
VALUES ('admin@example.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create initial regular user if it doesn't exist
-- Password is 'user' hashed with SHA-256
INSERT INTO users (email, password, role)
VALUES ('user@example.com', '04f8996da763b7a969b1028ee3007569eaf3a635486ddab211d512c85b9df8fb', 'user')
ON CONFLICT (email) DO NOTHING;
