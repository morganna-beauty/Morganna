-- Create database if it doesn't exist
SELECT 'CREATE DATABASE morganna_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'morganna_db')\gexec

-- Connect to the database
\c morganna_db;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types for hair products
CREATE TYPE hair_type_enum AS ENUM ('liso', 'ondulado', 'rizado', 'afro');
CREATE TYPE concern_enum AS ENUM ('cabelloSeco', 'danoReparacion', 'controlFriz', 'volumen');

-- Wait for TypeORM to create the basic table structure, then add our custom columns
-- This will be executed after the tables are created by TypeORM

-- Function to add columns if they don't exist
CREATE OR REPLACE FUNCTION add_product_columns() RETURNS void AS $$
BEGIN
    -- Add image_src column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_src') THEN
        ALTER TABLE products ADD COLUMN image_src VARCHAR(500);
    END IF;
    
    -- Add hair_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'hair_type') THEN
        ALTER TABLE products ADD COLUMN hair_type hair_type_enum;
    END IF;
    
    -- Add concern column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'concern') THEN
        ALTER TABLE products ADD COLUMN concern concern_enum;
    END IF;
    
    -- Add brand column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'brand') THEN
        ALTER TABLE products ADD COLUMN brand VARCHAR(100);
    END IF;
    
    -- Rename name to title if needed
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'name') THEN
        ALTER TABLE products RENAME COLUMN name TO title;
    END IF;
    
    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_products_hair_type ON products(hair_type);
    CREATE INDEX IF NOT EXISTS idx_products_concern ON products(concern);
    CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data (optional)
-- This will be executed after the tables are created by TypeORM
-- You can uncomment the following lines to insert sample products

-- Execute after table creation: SELECT add_product_columns();

-- INSERT INTO products (title, description, price, stock, image_src, hair_type, concern, brand, "createdAt", "updatedAt") 
-- VALUES 
--   ('Shampoo Hidratante Argan Oil', 'Shampoo hidratante enriquecido con aceite de argán para cabello seco', 29.99, 100, 'https://example.com/images/shampoo-argan.jpg', 'rizado', 'cabelloSeco', 'Morganna Beauty', NOW(), NOW()),
--   ('Acondicionador Reparador Keratina', 'Acondicionador reparador con keratina para cabello dañado', 32.99, 50, 'https://example.com/images/conditioner-keratin.jpg', 'liso', 'danoReparacion', 'Morganna Beauty', NOW(), NOW()),
--   ('Serum Anti-Friz', 'Serum profesional para control de friz y brillo intenso', 24.99, 75, 'https://example.com/images/serum-antifriz.jpg', 'ondulado', 'controlFriz', 'Morganna Beauty', NOW(), NOW()),
--   ('Mascarilla Volumen Natural', 'Mascarilla volumizadora para cabello fino y sin vida', 35.99, 30, 'https://example.com/images/mask-volume.jpg', 'afro', 'volumen', 'Morganna Beauty', NOW(), NOW())
-- ON CONFLICT DO NOTHING;
