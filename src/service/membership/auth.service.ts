import connection from "@/database/connection";
import { PoolConnection } from "mysql2/promise";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "@/config";
import User from "@/types/user";
import LoginBody from "@/types/auth/loginBody";
import RegisterBody from "@/types/auth/registerBody";
import BadRequestException from "@/exception/BadRequestException";
import UnauthorizedException from "@/exception/UnauthorizedException";
import balanceService from "@/service/transaction/balance.service";

export const login = async (data: LoginBody): Promise<{ token: string }> => {
  const [rows] = await connection.query<User[]>(
    "SELECT * FROM users WHERE email = ?",
    [data.email]
  );
  const user = rows[0];
  if (!user) {
    throw new UnauthorizedException(103, "Username atau password salah");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new UnauthorizedException(103, "Username atau password salah");
  }

  const token = jwt.sign({ id: user.id }, config.secretKey, {
    expiresIn: "12h",
  });

  return { token };
};

export const register = async (
  data: RegisterBody,
  conn?: PoolConnection
): Promise<User> => {
  const db = conn || connection;
  const { first_name: firstName, last_name: lastName, email, password } = data;

  const [rows] = await db.query<User[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  const existingUser = rows[0];
  if (existingUser) {
    throw new BadRequestException(102, "Paramter email tidak sesuai format");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const [result] = await db.query<any>(
    "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)",
    [firstName, lastName, email, hashedPassword]
  );

  const [insertedRows] = await db.query<User[]>(
    "SELECT * FROM users WHERE id = ?",
    [result.insertId]
  );
  return insertedRows[0];
};

export const registerUser = async (data: RegisterBody): Promise<User> => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    const user = await register(data, conn);
    await balanceService.createBalance(user, conn);
    await conn.commit();
    return user;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};
