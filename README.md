# 🧋 Milk Tea Shop Management System

A full-stack milk tea shop management system built with **Spring Boot +
MySQL + React (Vite)**.

This project simulates a real-world milk tea shop backend and POS-style
frontend for managing inventory, recipes, products, and orders.

------------------------------------------------------------------------

# 📌 Project Overview

This system allows administrators and staff to manage:

-   Inventory (ingredients stock)
-   Recipes
-   Products
-   Orders
-   Staff accounts
-   Order status workflow

The business logic follows this structure:

> Inventory → Recipe → Product → Order

------------------------------------------------------------------------

# 👥 Roles

## ADMIN

-   Manage orders
-   Manage inventory
-   Manage recipes
-   Manage products
-   Manage staff
-   View analytics

## STAFF

-   Create orders
-   Add order items
-   Complete orders
-   Cancel orders

------------------------------------------------------------------------

# 🧠 Business Logic

## 1️⃣ Inventory (Ingredients)

Ingredients must be created first.

Example ingredients: - Tea Base - Milk - Pearl - Sugar

Each ingredient contains: - name - stock quantity - low stock threshold

Recipes cannot be created without ingredients.

------------------------------------------------------------------------

## 2️⃣ Recipe

A recipe defines how a product is made.

Each recipe contains: - ingredient_id - quantity_required

Example (Pearl Milk Tea Recipe):

-   Tea Base → 100 ml
-   Milk → 50 ml
-   Pearl → 30 g

Recipes are not sold directly.\
They define how a product consumes inventory.

------------------------------------------------------------------------

## 3️⃣ Product

A product is what customers purchase.

Each product contains: - name - price (price_cents) - is_active flag -
recipe details

Example: - Pearl Milk Tea -- \$5.50

Products support: - Create - Update - Deactivate

------------------------------------------------------------------------

## 4️⃣ Order

Orders are created by staff.

Each order contains: - order_id - status (CREATED / COMPLETED /
CANCELED) - created_by - order items

------------------------------------------------------------------------

## 5️⃣ OrderItem

OrderItem is different from Product.

Even without customization:

-   Product = Template
-   OrderItem = Snapshot at purchase time

OrderItem stores: - product_id - quantity - price at time of purchase

This prevents historical data from changing when product prices change
later.

------------------------------------------------------------------------

# 🔄 Order Status Flow

CREATED → COMPLETED\
CREATED → CANCELED

-   CREATED: Order is being edited\
-   COMPLETED: Payment finished\
-   CANCELED: Order voided

------------------------------------------------------------------------

# 🏗️ System Architecture

## Backend

-   Spring Boot
-   JDBC
-   MySQL
-   REST API

## Frontend

-   React
-   Vite
-   React Router
-   Role-based route protection

------------------------------------------------------------------------

# 💻 How to Run the Project

## 1️⃣ Database Setup

### Step 1: Install MySQL

Make sure MySQL is installed and running.

### Step 2: Create Database

Run:

``` sql
CREATE DATABASE milktea;
```

### Step 3: Configure application.properties

Open:

backend/src/main/resources/application.properties

Update:

    spring.datasource.url=jdbc:mysql://localhost:3306/milktea
    spring.datasource.username=your_username
    spring.datasource.password=your_password

------------------------------------------------------------------------

## 2️⃣ Backend Setup (Spring Boot)

Go to backend folder:

    cd backend

Run using Maven Wrapper:

Windows:

    mvnw.cmd spring-boot:run

Mac/Linux:

    ./mvnw spring-boot:run

Backend runs on:

    http://localhost:8080

------------------------------------------------------------------------

## 3️⃣ Frontend Setup (React + Vite)

Go to frontend folder:

    cd frontend

Install dependencies:

    npm install

Start development server:

    npm run dev

Frontend runs on:

    http://localhost:5173

------------------------------------------------------------------------

# 📂 Project Structure

    milk-tea-management/
    │
    ├── backend/
    │   ├── controller/
    │   ├── service/
    │   ├── repository/
    │   ├── model/
    │   └── application.properties
    │
    ├── frontend/
    │   ├── pages/
    │   ├── components/
    │   ├── api/
    │   ├── auth/
    │   └── App.jsx
    │
    └── README.md

------------------------------------------------------------------------

# 🧩 Key Design Decisions

## Why Product and Recipe are separate?

-   Product = business object (price, active)
-   Recipe = ingredient composition
-   Keeps inventory logic clean
-   Improves scalability

------------------------------------------------------------------------

## Why OrderItem exists?

-   Prevents price mutation issues
-   Preserves historical order accuracy
-   Separates template data from transaction data

------------------------------------------------------------------------

# 🚀 Future Improvements

-   Sugar / Ice customization
-   Automatic stock deduction
-   Low stock warning system
-   Sales analytics dashboard
-   Payment integration simulation
-   Report export

------------------------------------------------------------------------

# 👩‍💻 Authors

Milk Tea Shop Management System\
University CPSC 471 Database / Software Engineering Project
