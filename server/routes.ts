import type { Express } from "express";
import { createServer, type Server } from "http";
import { insertChatSessionSchema, insertMessageSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  const BACKEND_BASE = process.env.BACKEND_BASE || "http://127.0.0.1:8000";

  const toCamel = (obj: any): any => {
    if (obj == null || typeof obj !== "object") return obj;
    if (Array.isArray(obj)) return obj.map(toCamel);
    const out: any = {};
    for (const [k, v] of Object.entries(obj)) {
      const camel = k.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      out[camel] = toCamel(v);
    }
    return out;
  };

  async function fwdJson(method: string, url: string, body?: any) {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const text = await res.text();
    let data: any = {};
    try { data = text ? JSON.parse(text) : {}; } catch {
      data = { message: text };
    }
    return { status: res.status, data } as const;
  }

  // Get all chat sessions
  app.get("/api/chat-sessions", async (req, res) => {
    try {
      const userId = (req.query.userId as string) || "";
      const url = `${BACKEND_BASE}/api/chat-sessions${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`;
      const { status, data } = await fwdJson("GET", url);
      if (status >= 400) return res.status(status).json(data);
      // Django returns snake_case; convert to camelCase
      return res.json(toCamel(data));
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to fetch chat sessions" });
    }
  });

  // Create new chat session
  app.post("/api/chat-sessions", async (req, res) => {
    const parsed = insertChatSessionSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ message: "Invalid session data", issues: parsed.error.issues });
    }
    // Map to Django payload
    const payload = { title: parsed.data.title, user_id: parsed.data.userId ?? null } as any;
    const { status, data } = await fwdJson("POST", `${BACKEND_BASE}/api/chat-sessions`, payload);
    if (status >= 400) return res.status(status).json(data);
    return res.json(toCamel(data));
  });

  // Get messages for a session
  app.get("/api/chat-sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { status, data } = await fwdJson("GET", `${BACKEND_BASE}/api/chat-sessions/${encodeURIComponent(sessionId)}/messages`);
      if (status >= 400) return res.status(status).json(data);
      // Convert created_at -> createdAt, etc.
      return res.json(toCamel(data));
    } catch (error: any) {
      res.status(500).json({ message: error?.message || "Failed to fetch messages" });
    }
  });

  // Create new message
  app.post("/api/messages", async (req, res) => {
    const parsed = insertMessageSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(422).json({ message: "Invalid message data", issues: parsed.error.issues });
    }
    // Django expects the same keys: sessionId, content, role
    const { status, data } = await fwdJson("POST", `${BACKEND_BASE}/api/messages`, parsed.data);
    if (status >= 400) return res.status(status).json(data);
    return res.json(toCamel(data));
  });

  // API 404 handler
  app.use("/api", (_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  const httpServer = createServer(app);
  return httpServer;
}

