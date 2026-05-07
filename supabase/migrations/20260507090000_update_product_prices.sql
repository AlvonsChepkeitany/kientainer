-- Update product price list by capacity
UPDATE products SET price = 4500 WHERE capacity_liters = 1000;
UPDATE products SET price = 10500 WHERE capacity_liters = 2000;
UPDATE products SET price = 12500 WHERE capacity_liters = 3000;
UPDATE products SET price = 14500 WHERE capacity_liters = 4000;
UPDATE products SET price = 16500 WHERE capacity_liters = 5000;
UPDATE products SET price = 19500 WHERE capacity_liters = 6000;
UPDATE products SET price = 24500 WHERE capacity_liters = 8000;
UPDATE products SET price = 32500 WHERE capacity_liters = 10000;
UPDATE products SET price = 88500 WHERE capacity_liters = 16000;
UPDATE products SET price = 137500 WHERE capacity_liters = 20000;
UPDATE products SET price = 162500 WHERE capacity_liters = 24000;

-- Add missing water tank products for the listed capacities
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
	'vertical-water-tank-1000l',
	'Vertical Water Tank 1,000L',
	c.id,
	1000,
	4500,
	'KES',
	'Compact vertical tank ideal for small homes.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 1000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-2000l',
	'Vertical Water Tank 2,000L',
	c.id,
	2000,
	10500,
	'KES',
	'Family-size storage for daily water needs.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 2000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-3000l',
	'Vertical Water Tank 3,000L',
	c.id,
	3000,
	12500,
	'KES',
	'Reliable storage for growing households.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 3000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-4000l',
	'Vertical Water Tank 4,000L',
	c.id,
	4000,
	14500,
	'KES',
	'Extra capacity for homes and small businesses.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 4000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-5000l',
	'Vertical Water Tank 5,000L',
	c.id,
	5000,
	16500,
	'KES',
	'Ideal for multi-family or rental compounds.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 5000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-6000l',
	'Vertical Water Tank 6,000L',
	c.id,
	6000,
	19500,
	'KES',
	'Steady supply for busy households.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 6000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-8000l',
	'Vertical Water Tank 8,000L',
	c.id,
	8000,
	24500,
	'KES',
	'Great for small businesses and apartments.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 8000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-10000l',
	'Vertical Water Tank 10,000L',
	c.id,
	10000,
	32500,
	'KES',
	'Bulk water storage for compound use.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 10000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-16000l',
	'Vertical Water Tank 16,000L',
	c.id,
	16000,
	88500,
	'KES',
	'Heavy-duty storage for institutions.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 16000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-20000l',
	'Vertical Water Tank 20,000L',
	c.id,
	20000,
	137500,
	'KES',
	'Industrial-grade supply for large facilities.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 20000 AND p.category_id = c.id
	);

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
	'vertical-water-tank-24000l',
	'Vertical Water Tank 24,000L',
	c.id,
	24000,
	162500,
	'KES',
	'Maximum capacity for commercial operations.',
	'Durable UV-stabilized food-grade tank for everyday storage.',
	ARRAY['https://source.unsplash.com/featured/?watertank,storage'],
	false,
	true
FROM categories c
WHERE c.slug = 'water-tanks'
	AND NOT EXISTS (
		SELECT 1 FROM products p WHERE p.capacity_liters = 24000 AND p.category_id = c.id
	);
