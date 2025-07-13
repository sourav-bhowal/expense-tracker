import {
  createKindeServerClient,
  GrantType,
  type SessionManager,
} from "@kinde-oss/kinde-typescript-sdk";
import { type Context } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { config } from "dotenv";

// Only load environment variables on the server side
if (typeof process !== "undefined") {
  config({ path: "../.env" });
}

// Ensure environment variables are set (only on server side)
if (typeof process !== "undefined") {
  if (
    !process.env.KINDE_DOMAIN ||
    !process.env.KINDE_CLIENT_ID ||
    !process.env.KINDE_CLIENT_SECRET ||
    !process.env.KINDE_REDIRECT_URI ||
    !process.env.KINDE_LOGOUT_REDIRECT_URI
  ) {
    throw new Error("Missing required Kinde environment variables");
  }
}

// Client for authorization code flow (only on server side)
export const kindeClient =
  typeof process !== "undefined"
    ? createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
        authDomain: process.env.KINDE_DOMAIN!,
        clientId: process.env.KINDE_CLIENT_ID!,
        clientSecret: process.env.KINDE_CLIENT_SECRET!,
        redirectURL: process.env.KINDE_REDIRECT_URI!,
        logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URI!,
      })
    : null;

export const sessionManager = (c: Context): SessionManager => ({
  getSessionItem: async (key: string) => {
    const result = getCookie(c, key);
    return result;
  },

  setSessionItem: async (key: string, value: unknown) => {
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
    } as const;

    if (typeof value === "string") {
      setCookie(c, key, value, cookieOptions);
    } else {
      setCookie(c, key, JSON.stringify(value), cookieOptions);
    }
  },

  removeSessionItem: async (key: string) => {
    deleteCookie(c, key);
  },

  destroySession: async () => {
    ["access_token", "refresh_token", "id_token", "user"].forEach((key) => {
      deleteCookie(c, key);
    });
  },
});
