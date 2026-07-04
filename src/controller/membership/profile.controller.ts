import { NextFunction, Request, Response } from "express";
import User from "@/types/user";
import sendResponse from "@/utils/responseHandler";
import validate from "@/utils/validation";
import BadRequestException from "@/exception/BadRequestException";
import { UploadedFile } from "express-fileupload";
import * as profileService from "@/service/membership/profile.service";

export const profile = (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;
    const profileData = profileService.getProfile(user);
    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Sukses",
      data: profileData,
    });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = validate({
      first_name: {
        type: "string",
        optional: true
      },
      last_name: {
        type: "string",
        optional: true
      }
    }, req.body);
    const user = req.user as User;

    await profileService.updateProfile(user.id, validatedData);
    sendResponse(res, { status: 0, statusCode: 200, message: "Profile berhasil diupdate" });
  } catch (err) {
    next(err);
  }
};

export const updateImage = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as User;

    if (!req.files?.image) {
      throw new BadRequestException(102, "Parameter image tidak sesuai format");
    }

    const file = req.files.image as UploadedFile;
    const updatedProfile = await profileService.updateImage(user, file);

    sendResponse(res, {
      status: 0,
      statusCode: 200,
      message: "Update Profile Image berhasil",
      data: updatedProfile
    });
  } catch (err) {
    next(err);
  }
};

export default {
    profile,
    updateProfile,
    updateImage
}