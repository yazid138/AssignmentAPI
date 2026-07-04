import Migration from 'mysql2-migrations'
import dotenv from 'dotenv'

dotenv.config()

const dbUrlStr = process.env.DATABASE_URL || "";
if (!dbUrlStr) {
  console.error("DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

const dbUrl = new URL(dbUrlStr);
const host = dbUrl.hostname;
const port = dbUrl.port || "3306";
const user = dbUrl.username;
const password = dbUrl.password;
const database = dbUrl.pathname.substring(1);

const db_query = new Migration()
db_query.database = database
db_query.user = user
db_query.password = password
db_query.host = host
db_query.port = parseInt(port)
db_query.name_table_migrations = "table_migrations_app"
db_query.show_query = true
db_query.skip_migration_error = true
db_query.show_depuration = true
db_query.start()
