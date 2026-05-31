-- Типы приёмов пищи
INSERT INTO meal_types (name) VALUES ('Завтрак');
INSERT INTO meal_types (name) VALUES ('Обед');
INSERT INTO meal_types (name) VALUES ('Ужин');
INSERT INTO meal_types (name) VALUES ('Перекус');

-- Профиль
INSERT INTO profile (weight, height, age, gender, activity, goal)
VALUES (70, 170, 25, 'female', 1.55, 'maintain');

-- Продукты
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Куриная грудка', 23.0, 2.0, 0.0, 110);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Рис отварной', 7.0, 1.0, 74.0, 333);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Яйцо куриное', 12.7, 11.5, 0.7, 157);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Гречка отварная', 12.6, 3.3, 57.1, 308);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Творог 5%', 21.0, 5.0, 3.0, 121);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Лосось', 20.0, 13.0, 0.0, 197);
INSERT INTO products (name, proteins, fats, carbs, calories)
VALUES ('Банан', 1.5, 0.2, 23.0, 96);

-- Приёмы пищи за 2026-05-31
INSERT INTO food_diary (date, meal_type_id) VALUES ('2026-05-31', 1);
INSERT INTO food_diary (date, meal_type_id) VALUES ('2026-05-31', 2);
INSERT INTO food_diary (date, meal_type_id) VALUES ('2026-05-31', 3);

-- Приёмы пищи за 2026-06-01
INSERT INTO food_diary (date, meal_type_id) VALUES ('2026-06-01', 1);
INSERT INTO food_diary (date, meal_type_id) VALUES ('2026-06-01', 4);

-- Состав приёмов
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (1, 3, 100);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (1, 5, 150);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (2, 1, 200);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (2, 2, 150);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (3, 4, 200);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (3, 1, 100);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (4, 5, 200);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (4, 7, 120);
INSERT INTO diary_items (diary_id, product_id, grams) VALUES (5, 6, 150);
