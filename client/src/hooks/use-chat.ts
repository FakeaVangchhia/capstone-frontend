import { useState } from "react";
import { type ChatSession } from "@shared/schema";

// Simple hook for managing chat state
export function useChat() {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  return { currentSession, setCurrentSession };
}
