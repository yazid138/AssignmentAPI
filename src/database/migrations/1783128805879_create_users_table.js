export default {
    "description": "Create users table",
    "up": "CREATE TABLE IF NOT EXISTS users (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255) NOT NULL, last_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password VARCHAR(255) NOT NULL, profile_image VARCHAR(255) NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE IF EXISTS users"
}