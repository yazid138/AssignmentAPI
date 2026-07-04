export default {
    "description": "create foreign key for service transaction table",
    "up": "ALTER TABLE transaction ADD CONSTRAINT fk_service_transaction_service FOREIGN KEY (service_code) REFERENCES services(service_code)",
    "down": "ALTER TABLE transaction DROP CONSTRAINT fk_service_transaction_service"
}