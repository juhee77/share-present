-- Flyway Migration V4: Add Thank-You Reply Card Columns to Orders Table

ALTER TABLE orders ADD COLUMN thank_you_sticker VARCHAR(255);
ALTER TABLE orders ADD COLUMN thank_you_message TEXT;
