import connection from "@/database/connection";
import User from "@/types/user";
import { RowDataPacket } from "mysql2";
import { PoolConnection } from "mysql2/promise";

export interface BalanceResult extends RowDataPacket {
  balance: number;
}

export const getBalance = async (user: User, conn?: PoolConnection): Promise<BalanceResult> => {
  const db = conn || connection;
  const [rows] = await db.query<BalanceResult[]>(
    "SELECT balance FROM balance WHERE user_id = ?",
    [user.id]
  );
  return rows[0];
};

export const createBalance = async (user: User, conn?: PoolConnection) => {
  const db = conn || connection;
  const [rows] = await db.query<BalanceResult[]>(
    "INSERT INTO balance (user_id, balance) VALUES (?, 0)",
    [user.id]
  );
  return rows[0];
}

export const updateBalance = async (user: User, topUpAmount: number, conn?: PoolConnection) => {
  const db = conn || connection;
  await db.query(
    "UPDATE balance SET balance = balance + ? WHERE user_id = ?",
    [topUpAmount, user.id]
  );
  const balanceResult = await getBalance(user, conn);
  return balanceResult;
}

let count = 1;
export const executeTopUp = async (user: User, topUpAmount: number): Promise<BalanceResult> => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      "UPDATE balance SET balance = balance + ? WHERE user_id = ?",
      [topUpAmount, user.id]
    );

    const invNumber = `INV-${Date.now()}-${count}`;
    await conn.query(`
      INSERT INTO transaction (user_id, invoice_number, total_amount, transaction_type, description, service_code) VALUES (?, ?, ?, ?, ?, ?)
    `, [user.id, invNumber, topUpAmount, "TOPUP", "Top Up balance", null]);

    const [rows] = await conn.query<BalanceResult[]>(
      "SELECT balance FROM balance WHERE user_id = ?",
      [user.id]
    );
    count++;
    
    await conn.commit();
    return rows[0];
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export default {
  getBalance,
  createBalance,
  updateBalance,
  executeTopUp,
}