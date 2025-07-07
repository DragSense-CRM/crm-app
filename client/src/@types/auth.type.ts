import { User } from "./user.type";

export type AuthUser = Omit<User, "createdAt" | "updatedAt">;
export type LoginData = {
  email: string;
  password: string;
};
export interface LoginResponse {
  user: User;
  token: string;
  message: string;
}
