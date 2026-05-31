-- Справочник продуктов
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    proteins REAL NOT NULL CHECK (proteins >= 0 AND proteins <= 100),
    fats REAL NOT NULL CHECK (fats >= 0 AND fats <= 100),
    carbs REAL NOT NULL CHECK (carbs >= 0 AND carbs <= 100),
    calories REAL NOT NULL
);

-- Типы приёмов пищи
CREATE TABLE meal_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Профиль пользователя
CREATE TABLE profile (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    weight REAL NOT NULL CHECK (weight > 0),
    height REAL NOT NULL CHECK (height > 0),
    age INTEGER NOT NULL CHECK (age > 0 AND age <= 150),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    activity REAL NOT NULL,
    goal TEXT NOT NULL CHECK (goal IN ('lose', 'maintain', 'gain'))
);

-- Приёмы пищи
CREATE TABLE food_diary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    meal_type_id INTEGER NOT NULL,
    FOREIGN KEY (meal_type_id) REFERENCES meal_types(id)
);

-- Состав приёма пищи
CREATE TABLE diary_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diary_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    grams REAL NOT NULL CHECK (grams > 0 AND grams <= 10000),
    FOREIGN KEY (diary_id) REFERENCES food_diary(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
