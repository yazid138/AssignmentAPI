import { NextFunction, Request, Response } from "express";
import sendResponse from "@/utils/responseHandler";
import validate from "@/utils/validation";
import BadRequestException from "@/exception/BadRequestException";
import RegisterBody from "@/types/auth/registerBody";
import LoginBody from "@/types/auth/loginBody";
import * as authService from "@/service/membership/auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate<LoginBody>(
      {
        email: "string",
        password: "string",
      },
      req.body,
    );
    const { token } = await authService.login(validatedData);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Berhasil Login",
      data: { token },
    });
  } catch (err) {
    next(err);
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate<RegisterBody>(
      {
        first_name: "string",
        last_name: "string",
        email: "email",
        password: {
          type: "string",
          min: 8,
          required: true,
        },
      },
      req.body,
    );
    await authService.registerUser(validatedData);
    sendResponse(res, { status: 0, statusCode: 201, message: "Registrasi berhasil silahkan login" });
  } catch (err) {
    next(err);
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((errLogout) => {
    if (errLogout) {
      throw new BadRequestException(
        102,
        "Logout gagal",
        errLogout.message || errLogout,
      );
    }
    sendResponse(res, { status: 0, statusCode: 200, message: "Logout berhasil" });
  });
};

export const me = (req: Request, res: Response) => {
  sendResponse(res, { status: 200, statusCode: 200, message: "User info", data: req.user });
};

export default {
  login,
  register,
  logout,
  me,
}
