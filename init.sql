-- Create database if it doesn't exist
SELECT 'CREATE DATABASE morganna_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'morganna_db')\gexec

-- Connect to the database
\c morganna_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert some sample data (optional)
-- This will be executed after the tables are created by TypeORM
-- You can uncomment the following lines to insert sample products

-- INSERT INTO products (name, description, price, stock, "createdAt", "updatedAt") 
-- VALUES 
--   ('Sample Product 1', 'This is a sample product for testing', 29.99, 100, NOW(), NOW()),
--   ('Sample Product 2', 'Another sample product', 49.99, 50, NOW(), NOW()),
--   ('Sample Product 3', 'Third sample product', 19.99, 75, NOW(), NOW())
-- ON CONFLICT DO NOTHING;
