import connection from "@/database/connection";
import { RowDataPacket } from "mysql2";

export interface ServicesResult extends RowDataPacket {
  service_code: string;
  service_name: string;
  service_icon: string;
  service_tariff: number;
  description: string;
}

export const getServices = async () => {
  const [rows] = await connection.query<ServicesResult[]>(
    "SELECT service_code, service_name, service_icon, service_tariff, description FROM services"
  );
  return rows.map((e) => ({
    service_code: e.service_code,
    service_name: e.service_name,
    service_icon: e.service_icon,
    service_tariff: Number(e.service_tariff),
  }));
};

export const getServiceByCode = async (serviceCode: string) => {
  const [rows] = await connection.query<ServicesResult[]>(
    "SELECT service_code, service_name, service_icon, service_tariff, description FROM services WHERE service_code = ?",
    [serviceCode]
  );
  return rows[0];
}
  
