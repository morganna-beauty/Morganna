-- Migration: Update Product Structure
-- Date: 2025-10-27
-- Description: Add new fields to products table and rename 'name' to 'title'

-- Add new columns
ALTER TABLE products 
ADD COLUMN image_src VARCHAR(500) NULL,
ADD COLUMN hair_type ENUM('liso', 'ondulado', 'rizado', 'afro') NULL,
ADD COLUMN concern ENUM('cabelloSeco', 'danoReparacion', 'controlFriz', 'volumen') NULL,
ADD COLUMN brand VARCHAR(100) NULL;

-- Rename 'name' column to 'title'
ALTER TABLE products 
CHANGE COLUMN name title VARCHAR(255) NOT NULL;

-- Update existing data (optional - if you have existing products)
-- UPDATE products SET title = name WHERE title IS NULL;

-- Add indexes for better performance (optional)
CREATE INDEX idx_products_hair_type ON products(hair_type);
CREATE INDEX idx_products_concern ON products(concern);
CREATE INDEX idx_products_brand ON products(brand);