"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import search params hook
import ChatLayout from "@/layout/ChatLayout";
import { useChat } from "@ai-sdk/react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import ChatForm from "@/components/form/ChatForm";
import Bar from "@/components/bar/Bar";
import Navbar from "@/components/navbar/Navbar";
import { v4 as uuidv4 } from "uuid";

export default function Page() {
  const searchParams = useSearchParams(); // Get query params
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<any[]>([]); // Stores messages from localStorage
  const [currentChatId, setCurrentChatId] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load token from localStorage
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      }

      // Check if a chat ID is provided in the query params
      const chatIdFromQuery = searchParams.get("chat");
      const chatId = chatIdFromQuery || uuidv4(); // Use query param or generate new chat ID
      setCurrentChatId(chatId);

      // Load chat history for the given chat ID
      const storedChatHistory = JSON.parse(localStorage.getItem(`chat_${chatId}`) || "[]");
      if (storedChatHistory.length > 0) {
        setLocalMessages(storedChatHistory);
      }
    }
  }, [searchParams]); // Re-run when URL query params change

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    onError: (error: any) => {
      if (error.message.includes("Unauthorized")) {
        setErrorMessage("You need to login to start a chat");
      } else {
        setErrorMessage("An error occurred while generating a response. Please try again later.");
      }
    }
  });

  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior

    // Check if currentChatId exists, if not, generate a new one
    const chatId = currentChatId || uuidv4();
    setCurrentChatId(chatId);
    
    // Immediately push the uuid to the current url
    router.push(`/?chat=${chatId}`);

    // Retrieve the existing chat list from localStorage
    let chatList = JSON.parse(localStorage.getItem("chat_list") || "[]");

    // Add the new chatId only if it's not already in the list
    if (!chatList.some((chat: any) => chat.chatId === chatId)) {
      chatList.push({
        chatId,
        message: input
      });
      localStorage.setItem("chat_list", JSON.stringify(chatList));
    }

    handleSubmit(event); // Call the original submit function
  }

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function mergeMessages(existingMessages: any[], newMessages: any[]) {
    const messageMap = new Map();
    [...existingMessages, ...newMessages].forEach((msg) => {
      messageMap.set(msg.id, msg);
    });
    return Array.from(messageMap.values());
  }

  // Save chat history to localStorage whenever a new message is sent
  useEffect(() => {
    if (messages.length > 0) {
      let existingHistory = JSON.parse(localStorage.getItem(`chat_${currentChatId}`) || "[]");

      // Merge new messages with existing ones, removing duplicates
      const updatedHistory = mergeMessages(existingHistory, messages);

      // Save updated chat history
      localStorage.setItem(`chat_${currentChatId}`, JSON.stringify(updatedHistory));

      // Update local state
      setLocalMessages(updatedHistory);
    }
  }, [messages]);

  return (
    <ProtectedRoute loginUrl="/sign-in">
      <ChatLayout>
        <Navbar />

        {/* Chat Messages */}
        <div className="flex flex-col w-full max-w-4xl mx-auto h-[80vh] overflow-y-auto px-2">
          {/* Render stored chat history first */}
          {localMessages.map((message, index) => (
            <div key={`${message.id}-${index}`} className={`whitespace-pre-wrap mb-3 ${message.role === "user" ? "chat chat-end" : ""}`}>
              {message.parts.map((part: any, i: number) => {
                if (part.type === "text") {
                  return (
                    <div
                      className={`${message.role === "user" ? "chat-bubble chat-bubble-neutral rounded-lg" : ""}`}
                      key={`${message.id}-${i}`}
                    >
                      {part.text}
                    </div>
                  );
                }
              })}
            </div>
          ))}

          {/* Invisible div for scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {errorMessage && <Bar variant="red" message={errorMessage} cn="max-w-4xl" />}

        <ChatForm
          handleSubmit={handleFormSubmit}
          input={input}
          handleInputChange={handleInputChange}
        />
        
      </ChatLayout>
    </ProtectedRoute>
  );
}