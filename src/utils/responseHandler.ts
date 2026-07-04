import { Response } from "express";
import ApiResponse from "@/types/apiResponse";

export default <T>(res: Response, response: ApiResponse<T>) => {
  const { statusCode, ...rest } = response
  res.status(statusCode || 500).json({ ...rest, data: rest.data || null });
};
