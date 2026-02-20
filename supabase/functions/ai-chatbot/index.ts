import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (per IP, resets on function cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20; // requests per minute
const RATE_WINDOW = 60 * 1000; // 1 minute

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return false;
  }
  
  if (record.count >= RATE_LIMIT) {
    return true;
  }
  
  record.count++;
  return false;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting by IP
    const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ reply: "Too many requests. Please wait a moment before trying again." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { message } = await req.json();
    
    if (!message || typeof message !== "string" || message.length > 1000) {
      return new Response(
        JSON.stringify({ reply: "Invalid message. Please keep your message under 1000 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a helpful AI assistant for engineersTech, a leading software development company based in Dhaka, Bangladesh.

About engineersTech:
- We offer Enterprise Solutions (HRM, CRM, ERP), Custom Web & Mobile Development, Security & Finance solutions, and AI Integration
- Contact: info@engineerstechbd.com, +880-1873722228
- WhatsApp: +880-1873722228
- Location: Dhaka, Bangladesh
- Website: engineerstechbd.com

Our Services:
- HRM (Human Resource Management) Systems
- CRM (Customer Relationship Management) Solutions
- ERP (Enterprise Resource Planning) Development
- Custom Web & Mobile Application Development
- AI & Machine Learning Integration
- Payment Gateway & Banking Solutions
- Data Security & Compliance Solutions

Guidelines:
- Be friendly, professional, and helpful
- Answer questions about our services accurately
- For pricing inquiries, direct users to contact us at +880-1873722228 or info@engineerstechbd.com
- For technical support, ask them to email info@engineerstechbd.com or WhatsApp +880-1873722228
- Keep responses concise (under 150 words)
- Always share our contact number +880-1873722228 when users ask how to reach us
- If you don't know something, offer to connect them with our team via WhatsApp at +880-1873722228`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ reply: "Service is busy. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ reply: "Service temporarily unavailable." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in ai-chatbot:", error);
    return new Response(
      JSON.stringify({ 
        reply: "I'm having trouble connecting right now. Please contact us at info@engineerstechbd.com for assistance." 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
