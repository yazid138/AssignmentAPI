export default {
    "description": "create banners table",
    "up": "CREATE TABLE IF NOT EXISTS banners(id INT AUTO_INCREMENT PRIMARY KEY, banner_name VARCHAR(255) NOT NULL, banner_image VARCHAR(255) NOT NULL, description VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE IF EXISTS banners"
}