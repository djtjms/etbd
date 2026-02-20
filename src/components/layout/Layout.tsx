import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Chatbot } from "@/components/chatbot/Chatbot";
import { WhatsAppButton } from "@/components/consultation/WhatsAppButton";

interface LayoutProps {
  children: ReactNode;
  showChatbot?: boolean;
}

export function Layout({ children, showChatbot = true }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pt-14 sm:pt-16 md:pt-20">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      {showChatbot && <Chatbot />}
    </div>
  );
}
