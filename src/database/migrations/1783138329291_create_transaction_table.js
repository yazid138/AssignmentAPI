export default {
    "description": "create transaction table",
    "up": "CREATE TABLE IF NOT EXISTS transaction (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT NOT NULL, invoice_number VARCHAR(255) NOT NULL UNIQUE, service_code VARCHAR(255) NULL, total_amount DECIMAL(10, 0) NOT NULL, transaction_type ENUM('PAYMENT', 'TOPUP') NOT NULL, description VARCHAR(255) NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)",
    "down": "DROP TABLE IF EXISTS transaction"
}