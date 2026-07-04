import { NextFunction, Request, Response } from "express";
import sendResponse from "@/utils/responseHandler";
import transactionService from "@/service/transaction/transaction.service";
import balanceService from "@/service/transaction/balance.service";
import User from "@/types/user";
import validate from "@/utils/validation";

export const getBalance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const result = await balanceService.getBalance(user);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const topUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { top_up_amount: topUpAmount } = validate<{ top_up_amount: number }>(
      {
        top_up_amount: {
          type: "number",
          min: 1,
          required: true,
        },
      },
      req.body,
    );
    const result = await balanceService.executeTopUp(user, topUpAmount);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Top Up Balance berhasil",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const createTransaction = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const { service_code: serviceCode } = validate<{
      service_code: string;
    }>({
      service_code: {
        type: "string",
        required: true,
      },
    }, req.body);

    const result = await transactionService.executePayment(user, serviceCode);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Transaksi berhasil",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const transactionList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const result = await transactionService.getTransactionList(user);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Success",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  getBalance,
  topUp,
  createTransaction,
  transactionList,
};