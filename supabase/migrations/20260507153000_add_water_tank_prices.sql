-- Add or update water tank products with requested capacities and prices
WITH water_tanks AS (
  SELECT id FROM categories WHERE slug = 'water-tanks'
)
INSERT INTO products (
  slug,
  name,
  category_id,
  capacity_liters,
  price,
  currency,
  short_description,
  description,
  images,
  featured,
  in_stock
)
SELECT
  v.slug,
  v.name,
  wt.id,
  v.capacity_liters,
  v.price,
  'KES',
  v.short_description,
  v.description,
  v.images,
  false,
  true
FROM (
  VALUES
    ('vertical-water-tank-1000l',  'Vertical Water Tank 1,000L',  1000,  4500,  'Compact vertical tank ideal for small homes.', 'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-2000l',  'Vertical Water Tank 2,000L',  2000, 10500,  'Family-size storage for daily water needs.',      'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-3000l',  'Vertical Water Tank 3,000L',  3000, 12500,  'Reliable storage for growing households.',        'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-4000l',  'Vertical Water Tank 4,000L',  4000, 14500,  'Balanced capacity for homes and small farms.',    'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-5000l',  'Vertical Water Tank 5,000L',  5000, 16500,  'Ideal for medium households and small estates.',  'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-6000l',  'Vertical Water Tank 6,000L',  6000, 19500,  'Extra storage for larger households and farms.',  'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-8000l',  'Vertical Water Tank 8,000L',  8000, 24500,  'Reliable bulk storage for farms and businesses.', 'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-10000l', 'Vertical Water Tank 10,000L', 10000, 32500, 'High-capacity storage for commercial use.',       'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-16000l', 'Vertical Water Tank 16,000L', 16000, 88500, 'Large-scale storage for estates and industry.',   'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-20000l', 'Vertical Water Tank 20,000L', 20000, 137500,'Industrial-grade storage for large sites.',       'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage']),
    ('vertical-water-tank-24000l', 'Vertical Water Tank 24,000L', 24000, 162500,'Maximum capacity for large operations.',          'Durable UV-stabilized food-grade tank for everyday storage.', ARRAY['https://source.unsplash.com/featured/?watertank,storage'])
) AS v(slug, name, capacity_liters, price, short_description, description, images)
CROSS JOIN water_tanks wt
ON CONFLICT (slug) DO UPDATE
SET
  name = EXCLUDED.name,
  category_id = EXCLUDED.category_id,
  capacity_liters = EXCLUDED.capacity_liters,
  price = EXCLUDED.price,
  currency = EXCLUDED.currency,
  short_description = EXCLUDED.short_description,
  description = EXCLUDED.description,
  images = EXCLUDED.images,
  in_stock = EXCLUDED.in_stock;

-- Ensure prices are updated if products already exist by capacity
UPDATE products
SET price = v.price
FROM (VALUES
  (1000, 4500),
  (2000, 10500),
  (3000, 12500),
  (4000, 14500),
  (5000, 16500),
  (6000, 19500),
  (8000, 24500),
  (10000, 32500),
  (16000, 88500),
  (20000, 137500),
  (24000, 162500)
) AS v(capacity_liters, price)
WHERE products.capacity_liters = v.capacity_liters
  AND products.category_id = (SELECT id FROM categories WHERE slug = 'water-tanks');
