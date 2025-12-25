/*
  # Noodle Shop Order Management System

  1. New Tables
    - `tables` - Dining tables in the restaurant
    - `menu_items` - Noodle dishes, appetizers, drinks
    - `menu_categories` - Categories for menu items
    - `modifiers` - Customization options (noodle type, broth, spice level)
    - `orders` - Customer orders by table
    - `order_items` - Individual items within each order
    - `order_item_modifiers` - Customizations applied to specific items

  2. Security
    - Enable RLS on all tables
    - Public read-only access to menu items and modifiers
    - Authenticated users (staff) can manage orders

  3. Key Features
    - Order status tracking: pending → cooking → ready → served
    - Item-level status tracking for kitchen workflow
    - Table management and active order dashboard
*/

CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number int UNIQUE NOT NULL,
  capacity int NOT NULL DEFAULT 4,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  display_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES menu_categories(id),
  name text NOT NULL,
  description text,
  price decimal(10, 2) NOT NULL,
  display_order int NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  name text NOT NULL,
  price_adjustment decimal(10, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id uuid NOT NULL REFERENCES tables(id),
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id uuid NOT NULL REFERENCES menu_items(id),
  quantity int NOT NULL DEFAULT 1,
  status text NOT NULL DEFAULT 'pending',
  special_requests text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_item_modifiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id uuid NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  modifier_id uuid NOT NULL REFERENCES modifiers(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE modifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_modifiers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tables are readable by authenticated users"
  ON tables FOR SELECT TO authenticated USING (true);

CREATE POLICY "Menu categories are publicly readable"
  ON menu_categories FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Menu items are publicly readable"
  ON menu_items FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Modifiers are publicly readable"
  ON modifiers FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Orders can be created by authenticated users"
  ON orders FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Orders can be viewed by authenticated users"
  ON orders FOR SELECT TO authenticated USING (true);

CREATE POLICY "Orders can be updated by authenticated users"
  ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Order items can be created by authenticated users"
  ON order_items FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Order items can be viewed by authenticated users"
  ON order_items FOR SELECT TO authenticated USING (true);

CREATE POLICY "Order items can be updated by authenticated users"
  ON order_items FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Order item modifiers can be created by authenticated users"
  ON order_item_modifiers FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Order item modifiers can be viewed by authenticated users"
  ON order_item_modifiers FOR SELECT TO authenticated USING (true);
