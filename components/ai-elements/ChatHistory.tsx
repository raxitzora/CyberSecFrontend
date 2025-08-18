"use client";

import { useState } from "react";
import { Search } from "lucide-react";

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

interface ChatHistoryProps {
  history: Chat[];
  onSelectChat?: (chat: Chat) => void;
  onNewChat?: () => void;
  onDeleteChat?: (id: string) => void;
  isLoading?: boolean;
}

export function ChatHistory({
  history,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  isLoading = false,
}: ChatHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const filteredHistory = history.filter((chat) => {
    const firstUserMessage = Array.isArray(chat.messages)
      ? chat.messages.find((msg) => msg.role === "user")?.text || "Untitled Chat"
      : "Untitled Chat";
    return firstUserMessage.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col h-full w-full md:w-80 bg-gradient-to-b from-gray-900 to-gray-800 border-r border-gray-700 shadow-xl transition-all duration-300">
      {/* Search + New Chat */}
      <div className="p-4 border-b border-gray-700">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            aria-label="Search chat history"
          />
        </div>
        <button
          onClick={onNewChat}
          className="w-full px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 shadow-md transition-colors duration-200"
          aria-label="Start new chat"
        >
          + New Chat
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredHistory.length === 0 ? (
          <p className="text-sm text-gray-400 p-4 text-center">
            {searchTerm ? "No matching chats found" : "No chats yet"}
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-gray-700">
            {filteredHistory.map((chat) => {
              const firstUserMessage = Array.isArray(chat.messages)
                ? chat.messages.find((msg) => msg.role === "user")?.text || "Untitled Chat"
                : "Untitled Chat";
              return (
                <li
                  key={chat.id}
                  className="flex justify-between items-center px-4 py-3 hover:bg-gray-700 transition-colors duration-150 rounded-lg mx-2 my-1"
                >
                  <button
                    onClick={() => onSelectChat?.(chat)}
                    className="text-left flex-1 truncate"
                    title={firstUserMessage}
                    aria-label={`Select chat: ${firstUserMessage}`}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-100 truncate">
                        {firstUserMessage.length > 40
                          ? firstUserMessage.substring(0, 40) + "..."
                          : firstUserMessage}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(chat.createdAt)}
                      </span>
                    </div>
                  </button>
                  <button
                    onClick={() => onDeleteChat?.(chat.id)}
                    className="ml-2 p-1 text-red-500 hover:text-red-400 transition-colors duration-150"
                    title="Delete chat"
                    aria-label={`Delete chat: ${firstUserMessage}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M9 7v12m6-12v12"
                      />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
