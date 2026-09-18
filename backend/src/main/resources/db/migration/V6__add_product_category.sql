-- Flyway Migration V6: Add category column to products table and seed category data

ALTER TABLE products ADD COLUMN category VARCHAR(50);

-- Update existing products with category keys
UPDATE products SET category = 'TABLEWARE' WHERE id IN (1, 4, 13);
UPDATE products SET category = 'FRAGRANCE' WHERE id IN (2, 6, 7, 10, 15);
UPDATE products SET category = 'HAND_BODY' WHERE id IN (3, 5, 8, 9, 12, 14);
UPDATE products SET category = 'TECH' WHERE id IN (11, 16);
