import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import ChatSidebar from "@/components/chat-sidebar";
import ChatArea from "@/components/chat-area";
import MessageInput from "@/components/message-input";
import { Button } from "@/components/ui/button";
import { Menu, User, Circle } from "lucide-react";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="gradient-bg min-h-screen text-foreground overflow-hidden">
      {/* Background Overlay */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-32 h-32 bg-primary/20 rounded-full blur-xl"></div>
          <div className="absolute top-1/3 right-20 w-40 h-40 bg-accent/15 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 left-1/3 w-28 h-28 bg-primary/25 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 h-screen flex">
        {/* Sidebar */}
        <ChatSidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col md:ml-0 relative">
          {/* Top Bar */}
          <div className="glass-dark border-b border-white/10 p-4 flex items-center justify-between backdrop-blur-xl">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className={`md:hidden glass-button rounded-xl p-3 hover-lift ${!isMobile ? 'hidden' : ''}`}
                onClick={() => setSidebarOpen(true)}
                data-testid="button-open-sidebar"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative">
                  <Circle className="w-3 h-3 text-green-400 fill-current pulse-glow" />
                  <div className="absolute inset-0 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-20"></div>
                </div>
                <span className="text-sm text-muted-foreground text-shadow font-medium">AI Assistant Online</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="hidden sm:flex items-center space-x-2 glass-effect rounded-full px-3 py-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-xs text-muted-foreground">Beta</span>
              </div>
              
              <Button 
                variant="ghost" 
                className="glass-button rounded-xl px-4 py-2 hover-lift text-shadow group"
                data-testid="button-login"
              >
                <User className="w-4 h-4 text-primary mr-2 group-hover:scale-110 transition-transform" />
                <span className="font-medium">Login</span>
              </Button>
            </div>
          </div>

          {/* Chat Messages Area */}
          <ChatArea />

          {/* Message Input Area */}
          <MessageInput />
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setSidebarOpen(false)}
          data-testid="overlay-sidebar"
        />
      )}
    </div>
  );
}
