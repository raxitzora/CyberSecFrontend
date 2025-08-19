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
    setIsHistoryOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setError(null);
    setCurrentChatId(null);
    setIsHistoryOpen(false);
  };

  const handleDeleteChat = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (currentChatId === id) {
      setMessages([]);
      setCurrentChatId(null);
    }
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setMessages([]);
    setError(null);
    setCurrentChatId(null);
    setIsHistoryOpen(false);
    localStorage.removeItem("chat_history");
  };

  const toggleHistory = () => {
    setIsHistoryOpen(!isHistoryOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:bg-gray-900 pt-16 sm:pt-0">
      {/* Hamburger Menu Button for Mobile */}
      <div className="sm:hidden p-4 border-b border-gray-700 bg-gray-900/80 backdrop-blur-md">
        <button
          onClick={toggleHistory}
          className="text-gray-200 p-2 rounded-lg hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 border border-2 solid"
          aria-label={isHistoryOpen ? "Close history menu" : "Open history menu"}
        >
          <h2 className="text-sm font-extrabold">History</h2>
          <Menu className="h-6 w-6"/>

        </button>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row flex-1 overflow-hidden">
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
              onSelectChat={handleSelectChat}
              onNewChat={handleNewChat}
              onDeleteChat={handleDeleteChat}
              isLoading={loading}
              isOpen={isHistoryOpen}
            />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex justify-between items-center">
              {messages.length > 0}
            {history.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="border-yellow-500 border-2  w-64 h-14 rounded-3xl text-xl font-extrabold text-red-500 hover:text-red-700"
              >
                Clear Neural Network
              </button>
            )}
          </div>
<div className="flex-1 overflow-y-auto">
          <Conversation>
            <ConversationContent className="p-4 sm:p-6">
              {messages.length === 0 && !loading && (
                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                  <p className="text-lg sm:text-xl font-medium">Start a New Conversation</p>
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
                <div>
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          </div>

          <PromptInput onSubmit={handleSubmit}>
            
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <PromptInputToolbar>
              <PromptInputSubmit
                disabled={!input.trim() || loading}
              />
            </PromptInputToolbar>
          </PromptInput>
        </div>
      </div>
    </div>
  );
}
