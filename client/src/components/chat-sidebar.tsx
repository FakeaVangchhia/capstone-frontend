import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, Plus, MessageCircle, GraduationCap } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type ChatSession } from "@shared/schema";
import { useChat } from "@/hooks/use-chat";

interface ChatSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeColors = [
  { name: "purple", gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)" },
  { name: "blue", gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
  { name: "green", gradient: "linear-gradient(135deg, #10b981, #059669)" },
];

export default function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const [selectedTheme, setSelectedTheme] = useState("purple");
  const queryClient = useQueryClient();
  const { currentSession, setCurrentSession } = useChat();

  const { data: chatSessions = [] } = useQuery<ChatSession[]>({
    queryKey: ["/api/chat-sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat-sessions", {
        title: "New Chat",
        userId: null,
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions"] });
      setCurrentSession(newSession);
    },
  });

  const handleNewChat = () => {
    createSessionMutation.mutate();
  };

  const handleSessionSelect = (session: ChatSession) => {
    setCurrentSession(session);
  };

  const formatTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <>
      <div className={`sidebar-glass w-80 md:w-72 lg:w-80 h-full fixed md:relative z-30 flex flex-col transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        {/* Sidebar Header */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <GraduationCap className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-shadow">StudyBot</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
              onClick={onClose}
              data-testid="button-close-sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1 text-shadow">AI Study Assistant</p>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            disabled={createSessionMutation.isPending}
            className="w-full glass-effect rounded-lg p-3 text-left hover:bg-white/20 transition-all duration-300 flex items-center space-x-3 text-shadow"
            variant="ghost"
            data-testid="button-new-chat"
          >
            <Plus className="w-4 h-4 text-primary" />
            <span className="font-medium">
              {createSessionMutation.isPending ? "Creating..." : "New Chat"}
            </span>
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto chat-scroll px-4 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-shadow">Recent Chats</h3>
          <div className="space-y-2">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground text-shadow">No chat history yet</p>
                <p className="text-xs text-muted-foreground text-shadow">Start a new conversation!</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => handleSessionSelect(session)}
                  className={`history-item rounded-lg p-3 cursor-pointer w-full text-left ${
                    currentSession?.id === session.id ? 'border-primary/50 bg-primary/10' : ''
                  }`}
                  data-testid={`button-session-${session.id}`}
                >
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-4 h-4 text-primary flex-shrink-0 mt-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate text-shadow">
                        {session.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 text-shadow">
                        {formatTimeAgo(session.updatedAt || session.createdAt || new Date())}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Theme Customization */}
        <div className="p-4 border-t border-white/10">
          <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-shadow">Theme Options</h4>
          <div className="grid grid-cols-3 gap-2">
            {themeColors.map((theme) => (
              <button
                key={theme.name}
                onClick={() => setSelectedTheme(theme.name)}
                className={`theme-button w-12 h-12 rounded-lg border relative overflow-hidden ${
                  selectedTheme === theme.name ? 'ring-2 ring-primary' : 'border-white/20'
                }`}
                style={{ background: theme.gradient }}
                data-testid={`button-theme-${theme.name}`}
              >
                <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
