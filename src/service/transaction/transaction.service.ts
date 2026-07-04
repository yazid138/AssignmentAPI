import connection from "@/database/connection";
import NotFoundException from "@/exception/NotFoundException";
import User from "@/types/user";
import { PoolConnection, RowDataPacket } from "mysql2/promise";
import { getServiceByCode } from "@/service/information/service.service";
import balanceService from "@/service/transaction/balance.service";
import BadRequestException from "@/exception/BadRequestException";

export const getTransactionById = async (transactionId: string) => {
    const [rows] = await connection.query<RowDataPacket[]>(`
        SELECT * FROM transaction WHERE id = ?
    `, [transactionId]);
    if(rows.length === 0){
        throw new NotFoundException(104, 'Transaction not found');
    }
    return rows[0];
}

let count = 1;
export const createTransaction = async (user: User, data: { type: "PAYMENT" | "TOPUP", amount: number, description: string, serviceCode?: string }, conn?: PoolConnection) => {
    const invNumber = `INV-${Date.now()}-${count}`;
    const db = conn || connection;
    const [result] = await db.query<any>(`
        INSERT INTO transaction (user_id, invoice_number, total_amount, transaction_type, description, service_code) VALUES (?, ?, ?, ?, ?, ?)
    `, [user.id, invNumber, data.amount, data.type, data.description, data.serviceCode || null]);
    count++;

    const [insertedRows] = await db.query<RowDataPacket[]>(`
        SELECT * FROM transaction WHERE id = ?
    `, [result.insertId]);
    return insertedRows[0];
}


export const getTransactionList = async (user: User, offset: number, limit: number) => {
    const [rows] = await connection.query<RowDataPacket[]>(`
        SELECT invoice_number, transaction_type, description, total_amount, created_at FROM transaction WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?
    `, [user.id, limit, offset]);
    return rows.map(e => ({
        invoice_number: e.invoice_number,
        transaction_type: e.transaction_type,
        description: e.description,
        total_amount: Number(e.total_amount),
        created_at: e.created_at,
    }));
}

export const executePayment = async (user: User, serviceCode: string) => {
  const findService = await getServiceByCode(serviceCode);
  if (!findService) {
    throw new NotFoundException(102, 'Service atau Layanan tidak ditemukan');
  }

  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    const balanceObj = await balanceService.getBalance(user, conn);
    if (balanceObj.balance < findService.service_tariff) {
      throw new BadRequestException(102, 'Saldo tidak mencukupi');
    }

    const transaction = await createTransaction(user, {
      type: "PAYMENT",
      amount: findService.service_tariff,
      description: findService.description,
      serviceCode: serviceCode,
    }, conn);

    await balanceService.updateBalance(user, -findService.service_tariff, conn);

    await conn.commit();
    return {
      invoice_number: transaction.invoice_number,
      service_code: findService.service_code,
      service_name: findService.service_name,
      transaction_type: transaction.transaction_type,
      total_amount: Number(transaction.total_amount),
      created_at: transaction.created_at,
    };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

export default {
    getTransactionById,
    createTransaction,
    getTransactionList,
    executePayment,
}