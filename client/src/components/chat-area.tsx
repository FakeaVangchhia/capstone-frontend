import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, Bot, User } from "lucide-react";
import { type Message } from "@shared/schema";
import { useChat } from "@/hooks/use-chat";

export default function ChatArea() {
  const { currentSession } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/chat-sessions", currentSession?.id, "messages"],
    enabled: !!currentSession?.id,
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!currentSession) {
    return (
      <div className="flex-1 overflow-y-auto chat-scroll p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <div className="glass-effect rounded-2xl p-8 inline-block">
              <GraduationCap className="w-16 h-16 text-primary mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2 text-shadow">Welcome to StudyBot</h2>
              <p className="text-muted-foreground text-shadow">Your AI-powered study companion. Start a new chat to begin!</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto chat-scroll p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {messages.length === 0 && (
          <div className="text-center py-8">
            <div className="glass-effect rounded-2xl p-8 inline-block">
              <GraduationCap className="w-16 h-16 text-primary mb-4 mx-auto" />
              <h2 className="text-2xl font-bold mb-2 text-shadow">Welcome to StudyBot</h2>
              <p className="text-muted-foreground text-shadow">Your AI-powered study companion. Ask me anything!</p>
            </div>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-start space-x-3 message-animation ${
              message.role === "user" ? "justify-end" : ""
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
            data-testid={`message-${message.role}-${message.id}`}
          >
            {message.role === "assistant" && (
              <div className="glass-effect rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
            )}
            
            <div
              className={`rounded-2xl p-4 max-w-2xl ${
                message.role === "user" 
                  ? "user-message" 
                  : "message-glass"
              }`}
            >
              <p className="text-foreground leading-relaxed text-shadow whitespace-pre-wrap">
                {message.content}
              </p>
            </div>

            {message.role === "user" && (
              <div className="glass-effect rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
