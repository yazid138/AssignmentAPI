import { Request, Response } from "express";
import sendResponse from "@/utils/responseHandler";
import { getServices } from "@/service/information/service.service";

const listService = async (req: Request, res: Response) => {
  const data = await getServices();

  sendResponse(res, {
    status: 0,
    statusCode: 200,
    message: "Sukses",
    data,
  });
};

export default {
  listService
}