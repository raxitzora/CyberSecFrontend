"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { ChatHistory } from "@/components/ai-elements/ChatHistory";
import { Message, MessageContent } from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";
import { AlertCircle } from "lucide-react";
import {toast} from "sonner";



type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type Chat = {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
};

export default function ChatBotDemo() {
  const { user, isSignedIn } = useUser();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load history (UI only)
  useEffect(() => {
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

  if (!isSignedIn) {
  toast.error("Please login first", {
    description: "You need to login to use the chatbot",
  });
  return;
}
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setError(null);

    const chatId = currentChatId || `chat-${Date.now()}`;

    if (!currentChatId) {
      setCurrentChatId(chatId);
      setHistory((prev) => [
        ...prev,
        { id: chatId, messages: [userMessage], createdAt: new Date().toISOString() },
      ]);
    } else {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === chatId ? { ...h, messages: [...h.messages, userMessage] } : h
        )
      );
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
        }),
      });

      if (!res.ok) throw new Error("API failed");

      const data = await res.json();

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: data.reply,
      };

      setMessages((prev) => [...prev, botMessage]);

      setHistory((prev) =>
        prev.map((h) =>
          h.id === chatId ? { ...h, messages: [...h.messages, botMessage] } : h
        )
      );

    } catch (err) {
      console.error(err);

      setError("Failed to connect to chatbot");

      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "⚠️ Error connecting to backend",
      };

      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] bg-gray-900 text-white">
      
      {/* Sidebar */}
      <div className="w-72 border-r border-gray-800 hidden sm:flex flex-col-1">
        <ChatHistory
          history={history}
          onSelectChat={(chat) => {
            setMessages(chat.messages);
            setCurrentChatId(chat.id);
            setError(null);
          }}
          onNewChat={() => {
            setMessages([]);
            setInput("");
            setError(null);
            setCurrentChatId(null);
          }}
          onDeleteChat={(id) => {
            setHistory((prev) => prev.filter((h) => h.id !== id));
            if (currentChatId === id) {
              setMessages([]);
              setCurrentChatId(null);
            }
          }}
          isLoading={loading}
          isOpen={true}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Top Bar */}
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4">
          <div className="max-w-3xl mx-auto py-6 space-y-6">

            {messages.length === 0 && !loading && (
              <div className="text-center text-gray-400 mt-20">
                <p className="text-lg">Start a conversation</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Message from={msg.role}>
                  <MessageContent
                    className={`px-4 py-3 rounded-2xl max-w-[80%] ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </MessageContent>
                </Message>
              </div>
            ))}

            {loading && (
              <div className="flex justify-center">
                <Loader />
              </div>
            )}

            {error && (
              <div className="flex justify-center text-red-400">
                <AlertCircle className="mr-2" />
                {error}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4 bg-gray-900">
          <form
            onSubmit={handleSubmit}
            className="max-w-3xl mx-auto flex gap-2"
          >
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
              placeholder="Send a message..."
              className="flex-1 resize-none rounded-xl bg-gray-800 p-3 outline-none"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="px-4 py-2 bg-blue-600 rounded-xl disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}