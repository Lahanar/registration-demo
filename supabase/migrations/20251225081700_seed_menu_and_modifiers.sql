/*
  # Seed Menu Items and Modifiers

  1. Insert menu categories
  2. Insert menu items with prices
  3. Insert modifier options for customization
  4. Insert dining tables
*/

INSERT INTO menu_categories (name, display_order) VALUES
  ('Noodle Soups', 1),
  ('Stir-Fried Noodles', 2),
  ('Appetizers', 3),
  ('Beverages', 4)
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (category_id, name, description, price, display_order)
SELECT id, 'Spicy Beef Noodle Soup', 'Tender beef with red chili broth', 8.99, 1
FROM menu_categories WHERE name = 'Noodle Soups'
UNION ALL
SELECT id, 'Chicken & Mushroom Soup', 'Fragrant chicken broth with shiitake mushrooms', 8.49, 2
FROM menu_categories WHERE name = 'Noodle Soups'
UNION ALL
SELECT id, 'Seafood Noodle Soup', 'Shrimp, squid, and fish cake in light broth', 10.99, 3
FROM menu_categories WHERE name = 'Noodle Soups'
UNION ALL
SELECT id, 'Vegetarian Pho', 'Aromatic broth with tofu and fresh vegetables', 7.99, 4
FROM menu_categories WHERE name = 'Noodle Soups'
UNION ALL
SELECT id, 'Sesame Oil Noodle', 'Fragrant sesame oil with garlic and scallions', 7.99, 1
FROM menu_categories WHERE name = 'Stir-Fried Noodles'
UNION ALL
SELECT id, 'Crispy Chow Mein', 'Pan-fried noodles with vegetables and protein', 8.99, 2
FROM menu_categories WHERE name = 'Stir-Fried Noodles'
UNION ALL
SELECT id, 'Pad Thai Style', 'Sweet and tangy noodles with peanuts', 8.49, 3
FROM menu_categories WHERE name = 'Stir-Fried Noodles'
UNION ALL
SELECT id, 'Spring Rolls', 'Crispy vegetable and shrimp rolls with sauce', 5.99, 1
FROM menu_categories WHERE name = 'Appetizers'
UNION ALL
SELECT id, 'Dumpling Basket', 'Six pieces of steamed or fried dumplings', 6.99, 2
FROM menu_categories WHERE name = 'Appetizers'
UNION ALL
SELECT id, 'Edamame', 'Steamed soybeans with sea salt', 4.99, 3
FROM menu_categories WHERE name = 'Appetizers'
UNION ALL
SELECT id, 'Iced Tea', 'Refreshing house-made iced tea', 2.99, 1
FROM menu_categories WHERE name = 'Beverages'
UNION ALL
SELECT id, 'Soft Drink', 'Assorted soft drinks (Coke, Sprite, etc.)', 2.49, 2
FROM menu_categories WHERE name = 'Beverages'
UNION ALL
SELECT id, 'Mango Smoothie', 'Fresh mango blended with ice', 3.99, 3
FROM menu_categories WHERE name = 'Beverages'
ON CONFLICT DO NOTHING;

INSERT INTO modifiers (category, name, price_adjustment) VALUES
  ('Noodle Type', 'Thin Egg Noodles', 0),
  ('Noodle Type', 'Wide Wheat Noodles', 0),
  ('Noodle Type', 'Rice Noodles', 0),
  ('Noodle Type', 'Ramen', 0.50),
  ('Broth', 'Regular Broth', 0),
  ('Broth', 'Rich & Creamy', 0.50),
  ('Broth', 'Spicy Chili Oil', 0),
  ('Broth', 'Clear Vegetable', 0),
  ('Spice Level', 'Mild', 0),
  ('Spice Level', 'Medium', 0),
  ('Spice Level', 'Hot', 0),
  ('Spice Level', 'Extra Hot', 0),
  ('Protein Add-on', 'Extra Beef', 2.00),
  ('Protein Add-on', 'Extra Chicken', 1.50),
  ('Protein Add-on', 'Extra Shrimp', 2.50),
  ('Protein Add-on', 'Tofu', 0.50),
  ('Vegetables', 'Add Bok Choy', 0.75),
  ('Vegetables', 'Add Broccoli', 0.75),
  ('Vegetables', 'Add Mushrooms', 0.75)
ON CONFLICT DO NOTHING;

INSERT INTO tables (table_number, capacity) VALUES
  (1, 2),
  (2, 2),
  (3, 4),
  (4, 4),
  (5, 6),
  (6, 6),
  (7, 8),
  (8, 8)
ON CONFLICT DO NOTHING;
