import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string;
  password: string;
  createdAt: Date;
}

export default User;
