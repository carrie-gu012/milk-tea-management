-- database/demo_order.sql
-- 演示：下单 2 杯 Pearl Milk Tea + 1 杯 Mango Green Tea

START TRANSACTION;

-- 1) 创建订单
INSERT INTO orders (status) VALUES ('CREATED');
SET @order_id = LAST_INSERT_ID();

-- 2) 插入订单项（锁定价格）
INSERT INTO order_item (order_id, product_id, quantity, price_cents)
SELECT @order_id, product_id, 2, price_cents
FROM product
WHERE name='Pearl Milk Tea';

INSERT INTO order_item (order_id, product_id, quantity, price_cents)
SELECT @order_id, product_id, 1, price_cents
FROM product
WHERE name='Mango Green Tea';

-- 3) 扣库存：按 (订单项数量 * recipe用量) 扣 inventory
UPDATE inventory inv
JOIN (
  SELECT r.ingredient_id,
         SUM(oi.quantity * r.qty_required) AS total_used
  FROM order_item oi
  JOIN recipe r ON r.product_id = oi.product_id
  WHERE oi.order_id = @order_id
  GROUP BY r.ingredient_id
) u ON u.ingredient_id = inv.ingredient_id
SET inv.quantity = inv.quantity - u.total_used;

COMMIT;

-- 看看库存变化
SELECT i.name, inv.quantity, i.unit
FROM inventory inv
JOIN ingredient i ON i.ingredient_id = inv.ingredient_id
ORDER BY i.name;

-- 看看订单内容
SELECT o.order_id, o.status, oi.product_id, p.name, oi.quantity, oi.price_cents
FROM orders o
JOIN order_item oi ON oi.order_id = o.order_id
JOIN product p ON p.product_id = oi.product_id
WHERE o.order_id = @order_id;
