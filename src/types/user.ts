import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  name: string;
  username: string;
  password: string;
  createdAt: Date;
}

export default User;
