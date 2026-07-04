export default {
    "description": "create foreign key for balance table",
    "up": "ALTER TABLE balance ADD CONSTRAINT fk_balance_user FOREIGN KEY (user_id) REFERENCES users(id)",
    "down": "ALTER TABLE balance DROP CONSTRAINT fk_balance_user"
}