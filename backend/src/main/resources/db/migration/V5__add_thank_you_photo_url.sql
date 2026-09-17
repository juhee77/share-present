-- Flyway Migration V5: Add Thank-You Photo URL Column to Orders Table

ALTER TABLE orders ADD COLUMN thank_you_photo_url VARCHAR(500);
