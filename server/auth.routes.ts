import { Hono } from "hono";
import { kindeClient, sessionManager } from "./kinde";

export const authRouter = new Hono()
  .get("/login", async (c) => {
    if (!kindeClient) {
      return c.json({ error: "Authentication not configured" }, 500);
    }
    const loginUrl = await kindeClient.login(sessionManager(c));
    return c.redirect(loginUrl.toString());
  })
  .get("/register", async (c) => {
    if (!kindeClient) {
      return c.json({ error: "Authentication not configured" }, 500);
    }
    const registerUrl = await kindeClient.register(sessionManager(c));
    return c.redirect(registerUrl.toString());
  })
  // Handle the callback from Kinde after login or registration
  .get("/callback", async (c) => {
    if (!kindeClient) {
      return c.json({ error: "Authentication not configured" }, 500);
    }
    const url = new URL(c.req.url);
    await kindeClient.handleRedirectToApp(sessionManager(c), url);
    return c.redirect("/");
  })
  .get("/logout", async (c) => {
    if (!kindeClient) {
      return c.json({ error: "Authentication not configured" }, 500);
    }
    const logoutUrl = await kindeClient.logout(sessionManager(c));
    return c.redirect(logoutUrl.toString());
  })
  .get("/me", async (c) => {
    if (!kindeClient) {
      return c.json({ error: "Authentication not configured" }, 500);
    }
    const isAuthenticated = await kindeClient.isAuthenticated(
      sessionManager(c)
    );
    if (!isAuthenticated) {
      return c.json({ error: "Not authenticated" }, 401);
    } else {
      const user = await kindeClient.getUser(sessionManager(c));
      return c.json(user);
    }
  });
