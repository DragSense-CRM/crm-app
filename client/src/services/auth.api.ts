import { apiRequest } from "@/utils/fetcher";
import {
  AuthUser,
  LoginData,
  LoginResponse,
} from "@/@types/auth.type";
import { IMessageResponse } from "@/@types/general.type";

const AUTH_API_PATH = `/auth`;

export const me = async () =>
  apiRequest<AuthUser>(`${AUTH_API_PATH}/me`, "GET");

export const login = async (data: LoginData) =>
  apiRequest<LoginResponse>(`${AUTH_API_PATH}/login`, "POST", data, undefined);

export const logout = async () =>
  apiRequest<IMessageResponse>(`${AUTH_API_PATH}/logout`, "POST", undefined);
