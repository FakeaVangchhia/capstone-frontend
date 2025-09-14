import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { X, Plus, MessageCircle, GraduationCap, MoreVertical } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { type ChatSession } from "@shared/schema";
import { useChat } from "@/hooks/use-chat";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

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
  const { user } = useAuth();
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameTitle, setRenameTitle] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);

  const { data: chatSessions = [] } = useQuery<ChatSession[]>({
    queryKey: ["/api/chat-sessions", user?.id || null],
    // Explicitly filter by userId to ensure per-user recent chats
    queryFn: async () => {
      if (!user?.id) return [] as ChatSession[];
      const res = await apiRequest(
        "GET",
        `/api/chat-sessions?userId=${encodeURIComponent(user.id)}`,
      );
      return res.json();
    },
    enabled: !!user?.id,
  });

  const createSessionMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/chat-sessions", {
        title: "New Chat",
        userId: user?.id ?? null,
      });
      return response.json();
    },
    onSuccess: (newSession) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions", user?.id || null] });
      setCurrentSession(newSession);
    },
  });

  const renameSessionMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await apiRequest("PATCH", `/api/chat-sessions/${encodeURIComponent(id)}`, { title });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions", user?.id || null] });
      setRenameOpen(false);
      setRenamingId(null);
      setRenameTitle("");
    },
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await apiRequest("DELETE", `/api/chat-sessions/${encodeURIComponent(id)}`);
      return res.json();
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat-sessions", user?.id || null] });
      if (currentSession?.id === vars.id) {
        setCurrentSession(null);
      }
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
            <div className="flex items-center space-x-3">
              <div className="glass-effect rounded-full w-10 h-10 flex items-center justify-center bounce-in">
                <GraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-shadow">CollegeGPT</h1>
                <p className="text-xs text-muted-foreground text-shadow">AI Study Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden glass-button rounded-lg p-2 hover-lift"
              onClick={onClose}
              data-testid="button-close-sidebar"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <Button
            onClick={handleNewChat}
            disabled={createSessionMutation.isPending}
            className="w-full glass-button rounded-xl p-4 text-left hover-lift flex items-center space-x-3 text-shadow group"
            variant="ghost"
            data-testid="button-new-chat"
          >
            <div className="glass-effect rounded-full w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-4 h-4 text-primary" />
            </div>
            <span className="font-medium">
              {createSessionMutation.isPending ? "Creating..." : "New Chat"}
            </span>
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto chat-scroll px-4 pb-4">
          <h3 className="text-sm font-semibold text-muted-foreground mb-3 text-shadow">Recent Chats</h3>
          <div className="space-y-3">
            {chatSessions.length === 0 ? (
              <div className="text-center py-8 fade-in">
                <div className="glass-effect rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground text-shadow mb-1">No chat history yet</p>
                <p className="text-xs text-muted-foreground text-shadow">Start a new conversation!</p>
              </div>
            ) : (
              chatSessions.map((session, index) => (
                <div key={session.id} className="group relative fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <button
                    onClick={() => handleSessionSelect(session)}
                    className={`history-item rounded-xl p-4 pr-12 cursor-pointer w-full text-left hover-lift transition-all duration-300 ${
                      currentSession?.id === session.id 
                        ? 'border-primary/50 bg-primary/15 shadow-lg shadow-primary/20' 
                        : 'hover:border-primary/30'
                    }`}
                    data-testid={`button-session-${session.id}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="glass-effect rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate text-shadow mb-1">
                          {session.title}
                        </p>
                        <p className="text-xs text-muted-foreground text-shadow">
                          {formatTimeAgo(session.updatedAt || session.createdAt || new Date())}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Hover three-dots button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-200 glass-button rounded-lg hover-lift"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => e.stopPropagation()}
                        aria-label="More options"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingId(session.id);
                          setRenameTitle(session.title);
                          setRenameOpen(true);
                        }}
                      >
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSessionMutation.mutate({ id: session.id });
                        }}
                      >
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input
              value={renameTitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRenameTitle(e.target.value)}
              placeholder="New title"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRenameOpen(false)}>Cancel</Button>
              <Button
                variant="ghost"
                className="glass-button"
                disabled={!renameTitle.trim() || !renamingId || renameSessionMutation.isPending}
                onClick={() => {
                  if (renamingId && renameTitle.trim()) {
                    renameSessionMutation.mutate({ id: renamingId, title: renameTitle.trim() });
                  }
                }}
              >
                {renameSessionMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
