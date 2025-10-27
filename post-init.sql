-- Post-initialization script for products table
-- Execute this after TypeORM creates the initial table structure

-- Add new columns to products table
SELECT add_product_columns();

-- Insert sample data
INSERT INTO products (title, description, price, stock, image_src, hair_type, concern, brand, "createdAt", "updatedAt") 
VALUES 
  ('Shampoo Hidratante Argan Oil', 'Shampoo hidratante enriquecido con aceite de argán para cabello seco y dañado', 29.99, 100, 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400', 'rizado', 'cabelloSeco', 'Morganna Beauty', NOW(), NOW()),
  ('Acondicionador Reparador Keratina', 'Acondicionador reparador con keratina para cabello dañado y quebradizo', 32.99, 50, 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400', 'liso', 'danoReparacion', 'Morganna Beauty', NOW(), NOW()),
  ('Serum Anti-Friz', 'Serum profesional para control de friz y brillo intenso', 24.99, 75, 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400', 'ondulado', 'controlFriz', 'Morganna Beauty', NOW(), NOW()),
  ('Mascarilla Volumen Natural', 'Mascarilla volumizadora para cabello fino y sin vida', 35.99, 30, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', 'afro', 'volumen', 'Morganna Beauty', NOW(), NOW()),
  ('Aceite Capilar Nutritivo', 'Aceite natural para nutrir y fortalecer todo tipo de cabello', 22.50, 80, 'https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=400', 'liso', 'cabelloSeco', 'Morganna Beauty', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Display results
SELECT 'Products table updated successfully' as status;
SELECT COUNT(*) as total_products FROM products;