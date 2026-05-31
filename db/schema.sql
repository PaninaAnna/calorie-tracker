-- Таблица продуктов
CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    proteins REAL NOT NULL CHECK (proteins >= 0),
    fats REAL NOT NULL CHECK (fats >= 0),
    carbs REAL NOT NULL CHECK (carbs >= 0),
    calories REAL NOT NULL
);

-- Таблица типов приёмов пищи
CREATE TABLE meal_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
);

-- Таблица приёмов пищи
CREATE TABLE food_diary (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL DEFAULT (date('now')),
    meal_type_id INTEGER NOT NULL,
    FOREIGN KEY (meal_type_id) REFERENCES meal_types(id)
);

-- Таблица состава приёма пищи
CREATE TABLE diary_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    diary_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    grams REAL NOT NULL CHECK (grams > 0),
    FOREIGN KEY (diary_id) REFERENCES food_diary(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
