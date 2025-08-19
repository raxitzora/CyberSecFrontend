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
  const [history, setHistory] = useState<Chat[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("chat_history");
      try {
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  });
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    localStorage.setItem("chat_history", JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setError(null);

    const chatId = currentChatId || Date.now().toString();
    if (!currentChatId) {
      setCurrentChatId(chatId);
      setHistory((prev) => [
        ...prev,
        { id: chatId, messages: [userMessage], createdAt: new Date().toISOString() },
      ]);
    } else {
      setHistory((prev) =>
        prev.map((h) =>
          h.id === currentChatId
            ? { ...h, messages: [...h.messages, userMessage] }
            : h
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
        id: Date.now().toString() + "-bot",
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
        id: Date.now().toString() + "-error",
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

  const handleSelectChat = (chat: Chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
    setError(null);
    setIsHistoryOpen(false); // Close history on mobile after selection
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    setCurrentChatId(null);
    setIsHistoryOpen(false); // Close history on mobile
  };

  const handleDeleteChat = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (currentChatId === id) {
      setMessages([]);
      setCurrentChatId(null);
    }
    setIsHistoryOpen(false); // Close history on mobile
  };

  const handleClearHistory = () => {
    setHistory([]);
    setMessages([]);
    setError(null);
    setCurrentChatId(null);
    setIsHistoryOpen(false); // Close history on mobile
    localStorage.removeItem("chat_history");
  };

  const toggleHistory = () => {
    console.log("Toggling history, isHistoryOpen:", !isHistoryOpen); // Debug log
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 pt-16 sm:pt-0">
      {/* Hamburger Menu Button for Mobile */}
      <div className="sm:hidden p-4 border-b border-gray-700 bg-gray-900">
        <button
          onClick={toggleHistory}
          className="text-white focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-md p-2"
          aria-label={isHistoryOpen ? "Close history menu" : "Open history menu"}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row flex-1">
        {/* Chat History Sidebar */}
        <div className="sm:w-64 md:w-80">
          <ChatHistory
            history={history}
            onSelectChat={handleSelectChat}
            onNewChat={handleNewChat}
            onDeleteChat={handleDeleteChat}
            isLoading={loading}
            isOpen={isHistoryOpen}
          />
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
              {messages.length > 0 ? "Conversation" : "Welcome to CyberSecAI"}
            </h2>
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                aria-label="Clear all chat history"
              >
                Clear History
              </button>
            )}
          </div>

          <Conversation className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-y-auto">
            <ConversationContent>
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
                  <p className="text-base sm:text-lg">Start a new conversation</p>
                  <p className="text-sm mt-2">Type your message below or select a previous chat from the sidebar.</p>
                </div>
              )}
              {messages.map((msg) => (
                <Message key={msg.id} from={msg.role} className="transition-all duration-200">
                  <MessageContent
                    className={
                      msg.role === "user" ? "bg-blue-100 dark:bg-blue-900" : "bg-gray-100 dark:bg-gray-700"
                    }
                  >
                    <Response>{msg.text}</Response>
                  </MessageContent>
                </Message>
              ))}
              {loading && (
                <div className="p-4">
                  <Loader />
                </div>
              )}
              {error && (
                <div className="p-4 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center gap-2 text-red-700 dark:text-red-300">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>

          <PromptInput onSubmit={handleSubmit} className="mt-4">
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              className="bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 text-sm sm:text-base"
              placeholder="Ask Grok anything..."
              aria-label="Type your message"
            />
            <PromptInputToolbar>
              <PromptInputSubmit
                disabled={!input.trim() || loading}
                className="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white text-sm sm:text-base"
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}