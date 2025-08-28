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
          <div className="glass-dark border-b border-white/10 p-4 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden glass-effect rounded-lg hover:bg-white/20 transition-all ${!isMobile ? 'hidden' : ''}`}
              onClick={() => setSidebarOpen(true)}
              data-testid="button-open-sidebar"
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2">
                <Circle className="w-2 h-2 text-green-400 fill-current pulse-glow" />
                <span className="text-sm text-muted-foreground text-shadow">AI Assistant Online</span>
              </div>
            </div>

            <Button 
              variant="ghost" 
              className="glass-effect rounded-lg px-4 py-2 hover:bg-white/20 transition-all duration-300 text-shadow"
              data-testid="button-login"
            >
              <User className="w-4 h-4 text-primary mr-2" />
              <span className="font-medium">Login</span>
            </Button>
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
