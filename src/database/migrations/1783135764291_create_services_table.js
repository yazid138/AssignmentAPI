export default {
    "description": "create services table",
    "up": "CREATE TABLE IF NOT EXISTS services(id INT AUTO_INCREMENT PRIMARY KEY, service_code VARCHAR(255) NOT NULL UNIQUE, service_name VARCHAR(255) NOT NULL, service_icon VARCHAR(255) NOT NULL, service_tariff DECIMAL(10, 0) NOT NULL, description VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE IF EXISTS services"
}