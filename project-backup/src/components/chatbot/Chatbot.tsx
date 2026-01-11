import { useState, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm the engineersTech assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("ai-chatbot", {
        body: { message: userMessage },
      });

      if (error) throw error;

      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: data.reply || "I'm sorry, I couldn't process your request." 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "I'm having trouble connecting right now. Please contact us at info@engineerstechbd.com for assistance." 
      }]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-primary shadow-primary flex items-center justify-center transition-all hover:scale-110 ${isOpen ? "hidden" : ""}`}
        aria-label="Open chat"
      >
        <MessageCircle size={24} className="text-primary-foreground" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 right-0 md:bottom-6 md:right-6 z-50 w-full md:w-96 h-[100dvh] md:h-[500px] bg-card border-l md:border border-border md:rounded-2xl shadow-2xl flex flex-col animate-scale-in">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold">e</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">engineersTech</h3>
                <p className="text-xs text-primary">AI Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-muted-foreground hover:text-foreground p-2"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-br-md" 
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="Type a message..."
                className="bg-secondary border-border"
                disabled={loading}
              />
              <Button 
                onClick={handleSend} 
                size="icon" 
                variant="gradient" 
                disabled={loading || !input.trim()}
              >
                <Send size={18} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
