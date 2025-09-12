import React, { createContext, useContext, useMemo, useState } from "react";
import { type ChatSession } from "@shared/schema";

type ChatContextValue = {
  currentSession: ChatSession | null;
  setCurrentSession: (s: ChatSession | null) => void;
};

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const value = useMemo(() => ({ currentSession, setCurrentSession }), [currentSession]);
  return React.createElement(ChatContext.Provider, { value }, children);
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return ctx;
}
