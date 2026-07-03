import mysql from "mysql2/promise";

// Create the connection pool to database
const pool = mysql.createPool({
	uri: process.env.DATABASE_URL || "",
	waitForConnections: true,
	connectionLimit: 10,
	queueLimit: 0,
});

const testConnection = async () => {
	const connection = await pool.getConnection();
	connection.release();
};

export { testConnection };

export default pool;

