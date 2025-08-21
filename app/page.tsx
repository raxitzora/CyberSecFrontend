"use client";

import { useState, useEffect, useRef } from "react";
import { ChatHistory } from "@/components/ai-elements/ChatHistory";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
} from "@/components/ai-elements/prompt-input";
import { Response } from "@/components/ai-elements/response";
import { Loader } from "@/components/ai-elements/loader";
import { AlertCircle, Menu } from "lucide-react";

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
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [mounted, setMounted] = useState(false); // to avoid SSR mismatch
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Run only on client
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setHistory(parsed);
      } catch {}
    }
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Save history to localStorage
  useEffect(() => {
    if (mounted) localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history, mounted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const tempId = `temp-${Math.random()}`; // client-safe ID
    const userMessage: ChatMessage = {
      id: tempId,
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
          h.id === currentChatId ? { ...h, messages: [...h.messages, userMessage] } : h
        )
      );
    }

    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");

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
    } catch (e) {
      console.error(e);
      setError("Failed to connect to the chatbot. Please try again.");
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        text: "⚠️ Error connecting to chatbot.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      setHistory((prev) =>
        prev.map((h) =>
          h.id === chatId ? { ...h, messages: [...h.messages, errorMessage] } : h
        )
      );
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  if (!mounted) return null; // avoid SSR mismatch

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:bg-gray-900 pt-16 sm:pt-0">
      {/* Hamburger Menu Button for Mobile */}
      <div className="sm:hidden p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
        <button
          onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          className="flex items-center gap-2 text-gray-200 p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border"
          aria-label={isHistoryOpen ? "Close history menu" : "Open history menu"}
        >
          <h2 className="text-sm font-extrabold">History</h2>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row flex-1 min-h-0 overflow-hidden">
        {/* Chat History Sidebar */}
        <div
          className={`sm:w-72 md:w-80 transition-all duration-500 ease-in-out sm:block ${
            isHistoryOpen
              ? "block max-h-full opacity-100"
              : "hidden max-h-0 opacity-0 sm:max-h-full sm:opacity-100"
          }`}
        >
          <div className="h-full">
            <ChatHistory
              history={history}
              onSelectChat={(chat) => {
                setMessages(chat.messages);
                setCurrentChatId(chat.id);
                setError(null);
                setIsHistoryOpen(false);
              }}
              onNewChat={() => {
                setMessages([]);
                setInput("");
                setError(null);
                setCurrentChatId(null);
                setIsHistoryOpen(false);
              }}
              onDeleteChat={(id) => {
                setHistory((prev) => prev.filter((h) => h.id !== id));
                if (currentChatId === id) {
                  setMessages([]);
                  setCurrentChatId(null);
                }
                setIsHistoryOpen(false);
              }}
              isLoading={loading}
              isOpen={isHistoryOpen}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Header */}
          <div className="flex justify-between items-center p-4 sm:p-6">
            {history.length > 0 && (
              <button
                onClick={() => {
                  setHistory([]);
                  setMessages([]);
                  setError(null);
                  setCurrentChatId(null);
                  setIsHistoryOpen(false);
                  localStorage.removeItem("chat_history");
                }}
                className="border-yellow-500 border-2 w-64 h-14 rounded-3xl text-xl font-extrabold text-red-500 hover:text-red-700"
              >
                Clear Neural Network
              </button>
            )}
          </div>

          {/* Scrollable messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6">
            <Conversation className="flex flex-col h-full">
              <ConversationContent className="flex flex-col gap-4">
                {messages.length === 0 && !loading && (
                  <div className="flex flex-col items-center justify-center h-full text-gray-300">
                    <p className="text-lg sm:text-xl font-medium">
                      Start a New Conversation
                    </p>
                    <p className="text-sm sm:text-base mt-2 opacity-75">
                      Type your message below or select a previous chat from the sidebar.
                    </p>
                  </div>
                )}

                {messages.map((msg) => (
                  <Message
                    key={msg.id}
                    from={msg.role}
                    className={`transition-all duration-200 mb-4 ${
                      msg.role === "user" ? "ml-auto max-w-[80%]" : "mr-auto max-w-[80%]"
                    }`}
                  >
                    <MessageContent>
                      <Response>{msg.text}</Response>
                    </MessageContent>
                  </Message>
                ))}

                {loading && (
                  <div className="p-4 flex justify-center">
                    <Loader className="text-orange-500" />
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 text-red-400">
                    <AlertCircle className="h-5 w-5" />
                    <span>{error}</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>

          {/* Fixed prompt input */}
          <div className="p-4 sm:p-6 border-t border-gray-700 bg-gray-900/80 backdrop-blur-md">
            <PromptInput onSubmit={handleSubmit}>
              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
              <PromptInputToolbar>
                <PromptInputSubmit disabled={!input.trim() || loading} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      </div>
    </div>
  );
}
