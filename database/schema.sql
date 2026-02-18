-- database/schema.sql  (MySQL 8)

-- CREATE DATABASE milk_tea_db;
-- USE milk_tea_db;

-- database/schema.sql  (MySQL 8)

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS order_item;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS recipe;
DROP TABLE IF EXISTS inventory;
DROP TABLE IF EXISTS ingredient;
DROP TABLE IF EXISTS product;
DROP TABLE IF EXISTS staff;
DROP TABLE IF EXISTS admin;

SET FOREIGN_KEY_CHECKS = 1;


CREATE TABLE admin (
  admin_id       INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(50) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE staff (
  staff_id       INT AUTO_INCREMENT PRIMARY KEY,
  username       VARCHAR(50) NOT NULL UNIQUE,
  password_hash  VARCHAR(255) NOT NULL,
  is_active      TINYINT(1) NOT NULL DEFAULT 1,

  created_by_admin_id INT NOT NULL,

  CONSTRAINT fk_staff_created_by_admin
    FOREIGN KEY (created_by_admin_id) REFERENCES admin(admin_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE product (
  product_id   INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL UNIQUE,
  price_cents  INT NOT NULL,
  is_active    TINYINT(1) NOT NULL DEFAULT 1,
  CHECK (price_cents > 0)
) ENGINE=InnoDB;

CREATE TABLE ingredient (
  ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100) NOT NULL UNIQUE,
  unit          VARCHAR(20) NOT NULL,

  type ENUM(
    'TOPPING',
    'DAIRY',
    'TEA_BASE',
    'SYRUP',
    'CONCENTRATE'
  ) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE inventory (
  ingredient_id INT PRIMARY KEY,
  quantity      DECIMAL(12,2) NOT NULL,
  CHECK (quantity >= 0),
  CONSTRAINT fk_inventory_ingredient
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE recipe (
  product_id     INT NOT NULL,
  ingredient_id  INT NOT NULL,
  qty_required   DECIMAL(12,2) NOT NULL,
  CHECK (qty_required > 0),
  PRIMARY KEY (product_id, ingredient_id),
  CONSTRAINT fk_recipe_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_recipe_ingredient
    FOREIGN KEY (ingredient_id) REFERENCES ingredient(ingredient_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;

CREATE TABLE orders (
  order_id     INT AUTO_INCREMENT PRIMARY KEY,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  status       ENUM('CREATED','COMPLETED','CANCELED') NOT NULL DEFAULT 'CREATED',
  created_by   VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE order_item (
  order_id     INT NOT NULL,
  product_id   INT NOT NULL,
  quantity     INT NOT NULL,
  price_cents  INT NOT NULL,
  CHECK (quantity > 0),
  CHECK (price_cents > 0),
  PRIMARY KEY (order_id, product_id),
  CONSTRAINT fk_order_item_order
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_order_item_product
    FOREIGN KEY (product_id) REFERENCES product(product_id)
    ON DELETE RESTRICT
) ENGINE=InnoDB;
