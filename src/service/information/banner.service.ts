import connection from "@/database/connection";
import { RowDataPacket } from "mysql2";

export interface BannerResult extends RowDataPacket {
  banner_name: string;
  banner_image: string;
  description: string;
}

export const getBanners = async (): Promise<BannerResult[]> => {
  const [rows] = await connection.execute<BannerResult[]>(
    "SELECT banner_name, banner_image, description FROM banners"
  );
  return rows;
};
