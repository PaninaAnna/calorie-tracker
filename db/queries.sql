-- 1. SELECT с условием: продукты с калорийностью меньше 200
SELECT * FROM products WHERE calories < 200;

-- 2. INSERT: добавить новый продукт
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Овсянка', 12.3, 6.1, 59.5, 342);

-- 3. UPDATE: изменить калорийность продукта
UPDATE products SET calories = 115 WHERE name = 'Куриная грудка';

-- 4. DELETE: удалить приём пищи (каскадно удалятся diary_items)
DELETE FROM food_diary WHERE id = 3;

-- 5. SELECT с JOIN: полный состав за день с названиями продуктов
SELECT
    fd.date,
    mt.name AS meal_type,
    p.name AS product_name,
    di.grams,
    ROUND(p.proteins * di.grams / 100, 1) AS proteins_total,
    ROUND(p.fats * di.grams / 100, 1) AS fats_total,
    ROUND(p.carbs * di.grams / 100, 1) AS carbs_total,
    ROUND(p.calories * di.grams / 100, 0) AS calories_total
FROM food_diary fd
JOIN meal_types mt ON fd.meal_type_id = mt.id
JOIN diary_items di ON di.diary_id = fd.id
JOIN products p ON di.product_id = p.id
WHERE fd.date = '2026-05-31'
ORDER BY fd.id, di.id;
