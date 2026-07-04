export default {
    "description": "create foreign key for transaction table",
    "up": "ALTER TABLE transaction ADD CONSTRAINT fk_transaction_user FOREIGN KEY (user_id) REFERENCES users(id)",
    "down": "ALTER TABLE transaction DROP CONSTRAINT fk_transaction_user"
}