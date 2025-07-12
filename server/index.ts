import { app } from "./app";

Bun.serve({
  fetch: app.fetch,
  port: 3000,
  hostname: "localhost",
});

console.log("Server is running on http://localhost:3000");
