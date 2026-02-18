-- database/seed.sql

-- database/seed.sql

-- Admin (default)
INSERT INTO admin (username, password_hash)
VALUES ('admin', '123456');

-- Staff (created by admin)
INSERT INTO staff (username, password_hash, created_by_admin_id)
SELECT 'staff1', 'staff123', a.admin_id
FROM admin a
WHERE a.username = 'admin';

-- =========================
-- Products (10 items)
-- =========================
INSERT INTO product (name, price_cents) VALUES
('Pearl Milk Tea', 650),
('Mango Green Tea', 700),
('Strawberry Oolong Tea', 720),
('Brown Sugar Boba Milk', 750),
('Cheese Foam Oolong', 780),
('Jasmine Green Tea', 620),
('Lemon Tea', 680),
('Peach Oolong Tea', 720),
('Taro Milk Tea', 760),
('Matcha Latte', 790);

-- =========================
-- Ingredients
-- =========================
INSERT INTO ingredient (name, unit, type) VALUES
('Pearl', 'g', 'TOPPING'),

('Milk', 'ml', 'DAIRY'),
('Cheese Foam', 'ml', 'DAIRY'),

('Tea Base', 'ml', 'TEA_BASE'),
('Jasmine Tea', 'ml', 'TEA_BASE'),

('Mango Syrup', 'ml', 'SYRUP'),
('Strawberry Syrup', 'ml', 'SYRUP'),
('Brown Sugar Syrup', 'ml', 'SYRUP'),
('Peach Syrup', 'ml', 'SYRUP'),
('Sugar Syrup', 'ml', 'SYRUP'),
('Lemon Juice', 'ml', 'SYRUP'),

('Taro Paste', 'g', 'CONCENTRATE'),
('Matcha Powder', 'g', 'CONCENTRATE');

-- =========================
-- Inventory (starting stock)
-- =========================
INSERT INTO inventory (ingredient_id, quantity)
SELECT ingredient_id,
       CASE name
         WHEN 'Pearl' THEN 2000
         WHEN 'Milk' THEN 12000
         WHEN 'Tea Base' THEN 20000
         WHEN 'Mango Syrup' THEN 3000
         WHEN 'Strawberry Syrup' THEN 3000
         WHEN 'Brown Sugar Syrup' THEN 3000
         WHEN 'Cheese Foam' THEN 4000
         WHEN 'Jasmine Tea' THEN 15000
         WHEN 'Lemon Juice' THEN 2000
         WHEN 'Peach Syrup' THEN 3000
         WHEN 'Taro Paste' THEN 3000
         WHEN 'Matcha Powder' THEN 1000
         WHEN 'Sugar Syrup' THEN 5000
         ELSE 0
       END
FROM ingredient;

-- =========================
-- Recipes
-- 规则：每杯用量（示例，足够课程展示）
-- =========================

-- 1) Pearl Milk Tea: Pearl 50g, Milk 200ml, Tea Base 150ml
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

-- 2) Mango Green Tea: Tea Base 200ml, Mango Syrup 80ml, Sugar Syrup 20ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Mango Green Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 80
FROM product p JOIN ingredient i
WHERE p.name='Mango Green Tea' AND i.name='Mango Syrup';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 20
FROM product p JOIN ingredient i
WHERE p.name='Mango Green Tea' AND i.name='Sugar Syrup';

-- 3) Strawberry Oolong Tea: Tea Base 200ml, Strawberry Syrup 70ml, Sugar Syrup 15ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Strawberry Oolong Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 70
FROM product p JOIN ingredient i
WHERE p.name='Strawberry Oolong Tea' AND i.name='Strawberry Syrup';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 15
FROM product p JOIN ingredient i
WHERE p.name='Strawberry Oolong Tea' AND i.name='Sugar Syrup';

-- 4) Brown Sugar Boba Milk: Pearl 60g, Milk 260ml, Brown Sugar Syrup 40ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 60
FROM product p JOIN ingredient i
WHERE p.name='Brown Sugar Boba Milk' AND i.name='Pearl';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 260
FROM product p JOIN ingredient i
WHERE p.name='Brown Sugar Boba Milk' AND i.name='Milk';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 40
FROM product p JOIN ingredient i
WHERE p.name='Brown Sugar Boba Milk' AND i.name='Brown Sugar Syrup';

-- 5) Cheese Foam Oolong: Tea Base 220ml, Cheese Foam 60ml, Sugar Syrup 10ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 220
FROM product p JOIN ingredient i
WHERE p.name='Cheese Foam Oolong' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 60
FROM product p JOIN ingredient i
WHERE p.name='Cheese Foam Oolong' AND i.name='Cheese Foam';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 10
FROM product p JOIN ingredient i
WHERE p.name='Cheese Foam Oolong' AND i.name='Sugar Syrup';

-- 6) Jasmine Green Tea: Jasmine Tea 220ml, Sugar Syrup 10ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 220
FROM product p JOIN ingredient i
WHERE p.name='Jasmine Green Tea' AND i.name='Jasmine Tea';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 10
FROM product p JOIN ingredient i
WHERE p.name='Jasmine Green Tea' AND i.name='Sugar Syrup';

-- 7) Lemon Tea: Tea Base 200ml, Lemon Juice 35ml, Sugar Syrup 15ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Lemon Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 35
FROM product p JOIN ingredient i
WHERE p.name='Lemon Tea' AND i.name='Lemon Juice';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 15
FROM product p JOIN ingredient i
WHERE p.name='Lemon Tea' AND i.name='Sugar Syrup';

-- 8) Peach Oolong Tea: Tea Base 200ml, Peach Syrup 70ml, Sugar Syrup 10ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Peach Oolong Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 70
FROM product p JOIN ingredient i
WHERE p.name='Peach Oolong Tea' AND i.name='Peach Syrup';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 10
FROM product p JOIN ingredient i
WHERE p.name='Peach Oolong Tea' AND i.name='Sugar Syrup';

-- 9) Taro Milk Tea: Tea Base 150ml, Milk 200ml, Taro Paste 60g, Sugar Syrup 10ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 150
FROM product p JOIN ingredient i
WHERE p.name='Taro Milk Tea' AND i.name='Tea Base';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 200
FROM product p JOIN ingredient i
WHERE p.name='Taro Milk Tea' AND i.name='Milk';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 60
FROM product p JOIN ingredient i
WHERE p.name='Taro Milk Tea' AND i.name='Taro Paste';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 10
FROM product p JOIN ingredient i
WHERE p.name='Taro Milk Tea' AND i.name='Sugar Syrup';

-- 10) Matcha Latte: Milk 260ml, Matcha Powder 6g, Sugar Syrup 15ml
INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 260
FROM product p JOIN ingredient i
WHERE p.name='Matcha Latte' AND i.name='Milk';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 6
FROM product p JOIN ingredient i
WHERE p.name='Matcha Latte' AND i.name='Matcha Powder';

INSERT INTO recipe (product_id, ingredient_id, qty_required)
SELECT p.product_id, i.ingredient_id, 15
FROM product p JOIN ingredient i
WHERE p.name='Matcha Latte' AND i.name='Sugar Syrup';
