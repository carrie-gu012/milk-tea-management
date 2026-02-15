-- database/seed.sql

-- Products
INSERT INTO product (name, price_cents) VALUES
('Pearl Milk Tea', 650),
('Mango Green Tea', 700);

-- Ingredients
INSERT INTO ingredient (name, unit) VALUES
('Pearl', 'g'),
('Milk', 'ml'),
('Tea Base', 'ml'),
('Mango Syrup', 'ml');

-- Inventory (starting stock)
INSERT INTO inventory (ingredient_id, quantity)
SELECT ingredient_id,
       CASE name
         WHEN 'Pearl' THEN 1000
         WHEN 'Milk' THEN 3000
         WHEN 'Tea Base' THEN 5000
         WHEN 'Mango Syrup' THEN 1000
       END
FROM ingredient;

-- Recipe:
-- Pearl Milk Tea: Pearl 50g, Milk 200ml, Tea Base 150ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 50
FROM product p JOIN ingredient i
WHERE p.name='Pearl Milk Tea' AND i.name='Pearl';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Pearl Milk Tea' AND i.name='Milk';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 150
FROM product p JOIN ingredient i
WHERE p.name='Pearl Milk Tea' AND i.name='Tea Base';

-- Mango Green Tea: Tea Base 200ml, Mango Syrup 80ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Mango Green Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 80
FROM product p JOIN ingredient i
WHERE p.name='Mango Green Tea' AND i.name='Mango Syrup';
