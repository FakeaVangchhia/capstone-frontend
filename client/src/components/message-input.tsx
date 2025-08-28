import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useChat } from "@/hooks/use-chat";
import { useToast } from "@/hooks/use-toast";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const [charCount, setCharCount] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const queryClient = useQueryClient();
  const { currentSession, setCurrentSession } = useChat();
  const { toast } = useToast();

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat-sessions", {
        title: message.slice(0, 50) + (message.length > 50 ? "..." : ""),
        userId: null,
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions"] });
      setCurrentSession(newSession);
      return newSession;
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ sessionId, content }: { sessionId: string; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", {
        sessionId,
        content,
        role: "user",
      });
      return response.json();
    },
    onSuccess: () => {
      if (currentSession) {
        queryClient.invalidateQueries({ 
          queryKey: ["/api/chat-sessions", currentSession.id, "messages"] 
        });
        queryClient.invalidateQueries({ 
          queryKey: ["/api/chat-sessions"] 
        });
      }
      setMessage("");
      setCharCount(0);
      autoResize();
      
      // Poll for AI response
      setTimeout(() => {
        if (currentSession) {
          queryClient.invalidateQueries({ 
            queryKey: ["/api/chat-sessions", currentSession.id, "messages"] 
          });
        }
      }, 1500);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;

    try {
      let sessionId = currentSession?.id;
      
      if (!sessionId) {
        const newSession = await createSessionMutation.mutateAsync();
        sessionId = newSession.id;
      }

      if (sessionId) {
        await sendMessageMutation.mutateAsync({
          sessionId,
          content: trimmedMessage,
        });
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 2000) {
      setMessage(value);
      setCharCount(value.length);
      autoResize();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  };

  useEffect(() => {
    autoResize();
  }, [message]);

  const isLoading = sendMessageMutation.isPending || createSessionMutation.isPending;

  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="floating-input rounded-2xl p-4">
          <div className="flex items-end space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="glass-effect rounded-xl p-3 hover:bg-white/20 transition-all duration-300 flex-shrink-0"
              data-testid="button-attach-file"
            >
              <Paperclip className="w-4 h-4 text-muted-foreground" />
            </Button>
            
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about your studies..."
                className="w-full bg-transparent text-foreground placeholder-muted-foreground resize-none focus:outline-none text-shadow border-none focus:ring-0 min-h-[24px] p-0"
                disabled={isLoading}
                data-testid="input-message"
              />
            </div>
            
            <Button
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              className="glass-effect rounded-xl p-3 hover:bg-primary/20 transition-all duration-300 flex-shrink-0 pulse-glow disabled:opacity-50 disabled:cursor-not-allowed"
              variant="ghost"
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4 text-primary" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span className="text-shadow">Press Enter to send, Shift+Enter for new line</span>
            </div>
            <span 
              className={`text-shadow ${charCount > 1800 ? 'text-destructive' : ''}`}
              data-testid="text-char-count"
            >
              {charCount}/2000
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
