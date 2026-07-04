export default {
    "description": "create balance table",
    "up": "CREATE TABLE IF NOT EXISTS balance (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, balance INT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE IF EXISTS balance"
}