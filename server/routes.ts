import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChatSessionSchema, insertMessageSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chat sessions
  app.get("/api/chat-sessions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      const sessions = await storage.getChatSessionsByUser(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions" });
    }
  });

  // Create new chat session
  app.post("/api/chat-sessions", async (req, res) => {
    try {
      const validatedData = insertChatSessionSchema.parse(req.body);
      const session = await storage.createChatSession(validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  // Get messages for a session
  app.get("/api/chat-sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getMessagesBySession(sessionId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create new message
  app.post("/api/messages", async (req, res) => {
    try {
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(validatedData);
      
      // Update session timestamp
      await storage.updateChatSession(validatedData.sessionId, {
        updatedAt: new Date(),
      });

      // Simulate AI response
      if (validatedData.role === "user") {
        setTimeout(async () => {
          const aiResponse = {
            sessionId: validatedData.sessionId,
            content: generateAIResponse(validatedData.content),
            role: "assistant" as const,
          };
          await storage.createMessage(aiResponse);
        }, 1000);
      }
      
      res.json(message);
    } catch (error) {
      res.status(400).json({ message: "Invalid message data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function generateAIResponse(userMessage: string): string {
  const responses = [
    "That's a great question! Let me help you understand this concept better. Could you provide more context about what specifically you'd like to explore?",
    "I'd be happy to help you with that topic. Let me break it down into simpler components so we can tackle this step by step.",
    "Excellent! This is an important area of study. Let me provide you with a comprehensive explanation and some practical examples.",
    "That's a fascinating subject to explore. I'll guide you through the key concepts and help you build a solid understanding.",
    "Perfect! Let's dive into this together. I'll explain the fundamentals and show you how to apply these concepts in practice.",
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
}
