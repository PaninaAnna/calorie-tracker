-- 1. SELECT с условием: все продукты с калорийностью меньше 200
SELECT * FROM products WHERE calories < 200;

-- 2. INSERT: добавить новый продукт
INSERT INTO products (name, proteins, fats, carbs, calories) VALUES ('Лосось', 20.0, 13.0, 0.0, 197);

-- 3. UPDATE: изменить калорийность продукта
UPDATE products SET calories = 115 WHERE name = 'Куриная грудка';

-- 4. DELETE: удалить приём пищи (каскадно удалятся diary_items)
DELETE FROM food_diary WHERE id = 3;

-- 5. SELECT с JOIN: полный состав приёмов пищи за день с названиями продуктов
SELECT
    fd.id AS diary_id,
    fd.date,
    mt.name AS meal_type,
    p.name AS product_name,
    di.grams,
    (p.proteins * di.grams / 100) AS proteins_total,
    (p.fats * di.grams / 100) AS fats_total,
    (p.carbs * di.grams / 100) AS carbs_total,
    (p.calories * di.grams / 100) AS calories_total
FROM food_diary fd
JOIN meal_types mt ON fd.meal_type_id = mt.id
JOIN diary_items di ON di.diary_id = fd.id
JOIN products p ON di.product_id = p.id
WHERE fd.date = '2026-05-31'
ORDER BY fd.id;
