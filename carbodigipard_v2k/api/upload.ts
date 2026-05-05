import { Hono } from "hono";
import { nanoid } from "nanoid";
import fs from "fs";
import path from "path";
import { env } from "./lib/env";

export const uploadRouter = new Hono();

uploadRouter.post("/", async (c) => {
  try {
    const body = await c.req.parseBody();
    const file = body["file"];

    if (!file || !(file instanceof File)) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure uploads directory exists
    const publicDir = env.isProduction
      ? path.resolve(process.cwd(), "dist/public")
      : path.resolve(process.cwd(), "public");
    
    const uploadsDir = path.join(publicDir, "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const ext = path.extname(file.name) || ".jpg";
    const filename = `${nanoid(10)}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    // Save file
    fs.writeFileSync(filePath, buffer);

    // Return URL
    return c.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error("Upload error:", err);
    return c.json({ error: "Upload failed" }, 500);
  }
});
