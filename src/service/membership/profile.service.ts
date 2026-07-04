import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";
import connection from "@/database/connection";
import BadRequestException from "@/exception/BadRequestException";
import config from "@/config";
import User from "@/types/user";

const PROFILE_IMAGE_URL = `${config.baseUrl}:${config.port}/images/profile/`;

export interface ProfileResponse {
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
}

export const getProfile = (user: User): ProfileResponse => {
  const defaultProfileImage = `https://ui-avatars.com/api/?name=${user.first_name}+${user.last_name}`;
  return {
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    profile_image: user.profile_image || defaultProfileImage,
  };
};

export const updateProfile = async (
  userId: number,
  data: { first_name?: string; last_name?: string }
): Promise<void> => {
  await connection.execute(
    "UPDATE users SET first_name = ?, last_name = ? WHERE id = ?",
    [data.first_name || null, data.last_name || null, userId]
  );
};

export const updateImage = async (
  user: User,
  file: UploadedFile
): Promise<ProfileResponse> => {
  // Validation
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedExtensions = [".jpg", ".jpeg", ".png"];
  const ext = path.extname(file.name).toLowerCase();

  if (!allowedExtensions.includes(ext) || !allowedTypes.includes(file.mimetype)) {
    throw new BadRequestException(102, "Format Image tidak sesuai");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new BadRequestException(102, "Ukuran file melebihi batas (2MB)");
  }

  const imagesDir = path.join(process.cwd(), "public", "images", "profile");
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  const fileName = `user_${user.id}_${Date.now()}${ext}`;
  const filePath = path.join(imagesDir, fileName);

  // Move temp file to persistent storage
  try {
    await file.mv(filePath);
  } catch (err) {
    throw new BadRequestException(102, "Gagal menyimpan file");
  }

  const profileImageUrl = PROFILE_IMAGE_URL + fileName;

  // Update database
  await connection.execute(
    "UPDATE users SET profile_image = ? WHERE id = ?",
    [profileImageUrl, user.id]
  );

  return {
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    profile_image: profileImageUrl,
  };
};
