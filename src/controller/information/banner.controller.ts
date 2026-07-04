import { Request, Response } from "express";
import sendResponse from "@/utils/responseHandler";
import { getBanners } from "@/service/information/banner.service";

const listBanner = async (req: Request, res: Response) => {
  const rows = await getBanners();

  sendResponse(res, {
    status: 0,
    statusCode: 200,
    message: "Sukses",
    data: rows,
  });
};

export default {
  listBanner
}