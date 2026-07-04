import { NextFunction, Request, Response } from "express";
import HttpException from "@/types/httpException";
import sendResponse from "@/utils/responseHandler";

export default () =>
  (err: HttpException, req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(err)
      sendResponse(res, {
        status: err.status,
        statusCode: err.statusCode,
        message: err.message,
        error: err.error || undefined,
      });
    } catch (error) {
      console.error(error);
      sendResponse(res, {
        status: 110,
        statusCode: 500,
        message: "Internal Server Error",
      });
    }
  };
