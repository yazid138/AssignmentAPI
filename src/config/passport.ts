import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import config from "@/config";
import bcrypt from "bcrypt";
import UserResponse from "@/types/userResponse";
import User from "@/types/user";
import connection from "@/database/connection";

passport.use(
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (
      username: string,
      password: string,
      done: (error: boolean, user?: User, info?: { message: string }) => void,
    ) => {
      try {
        const [rows] = await connection.query<User[]>("SELECT * FROM users WHERE username = ?", [username]);
        const user = rows[0];
        if (!user) {
          return done(true, undefined, { message: "Username tidak ditemukan" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(true, undefined, { message: "Password salah" });
        }
        return done(false, user, { message: "Berhasil Login" });
      } catch (err) {
        return done(true);
      }
    },
  ),
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter("token"),
      ]),
      secretOrKey: config.secretKey,
    },
    async (
      payload: { id: number },
      done: (err: boolean, user?: UserResponse) => void,
    ) => {
      try {
        const [rows] = await connection.query<User[]>("SELECT * FROM users WHERE id = ?", [payload.id]);
        const user = rows[0];
        if (!user) {
          return done(true);
        }
        done(false, user);
      } catch (err) {
        return done(true);
      }
    },
  ),
);
