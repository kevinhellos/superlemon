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
import ChatBubble from "@/components/message/ChatBubble";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/auth/firebase-client";
import { mergeMessages } from "@/lib/utils";
import { Toaster } from "react-hot-toast";
// import { Eye } from "lucide-react";

export default function Chat() {
  const searchParams = useSearchParams(); // Get query params
  const [token, setToken] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [chatResponseIsLoading, setChatResponseIsLoading] = useState<boolean>(false);
  // const [canModifyChat, setCanModifyChat] = useState<boolean>(true);
  const router = useRouter();

  // Code works - DO NOT TOUCH
  async function getChatHistoryFromDb(chatId: string) {
    let chatHistory: any = {};
    const chatHistorySnapshot = await getDoc(doc(db, "chats", chatId));
    
    if (chatHistorySnapshot.exists()) {
      chatHistory = chatHistorySnapshot.data();
      return chatHistory;
    }
    else {
      setErrorMessage(`Failed to retrieve chat history for chat ${currentChatId}`);
      console.error(`[CLIENT ERROR]: Failed to retrieve chat history data for chat id ${chatId}`);
    }
  }
  // Code works - DO NOT TOUCH

  // Code works - DO NOT TOUCH 
  useEffect(() => {
    setErrorMessage(""); // Always reset the error message

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

      // Load chat history for the given chat ID - DB
      async function loadChatHistoryFromDb(chatIdFromQuery: string) {
        let storedChatHistory = await getChatHistoryFromDb(chatIdFromQuery);
        if (JSON.parse(storedChatHistory["json"]).length > 0) {
          setLocalMessages(JSON.parse(storedChatHistory["json"]));
        }
      }

      // If chatIdFromQuery exists as a query in the current param
      if (chatIdFromQuery) {
        // console.log(`[CLIENT LOG]: Loading chat history for chat id ${chatIdFromQuery}`);
        loadChatHistoryFromDb(chatIdFromQuery);
      }

    }
  }, [searchParams]); // Re-run when URL query params change
  // Code works - DO NOT TOUCH

  // Code works - DO NOT TOUCH
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    
    onResponse: () => setChatResponseIsLoading(false),
    
    onError: (error: any) => {
      // console.error("[CLIENT ERROR]: " + error);
      if (error.message.includes("Unauthorized")) {
        setErrorMessage("You need to login to start a chat");
      } 
      else if (error.message.includes("Relogin required")){
        setErrorMessage("You need to re-login to authenticate");
      }
      else {
        setErrorMessage("An error occurred while generating a response. Please try again later.");
      }
    }
  });
  // Code works - DO NOT TOUCH

   // Code works - DO NOT TOUCH
  async function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); // Prevent default form submission behavior (page refresh)

    setChatResponseIsLoading(true);

    // Check if currentChatId exists, if not, generate a new one
    const chatId = currentChatId || uuidv4();
    setCurrentChatId(chatId);

    // Immediately push the uuid to the current url
    router.push(`/?chat=${chatId}`);

    await setDoc(doc(db, "chats", chatId), {
      json: "[]", // Empty array for initial states
      user_uid: auth?.currentUser?.uid
    });
    
    handleSubmit(event); // Call the original submit function
  }
   // Code works - DO NOT TOUCH

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Code works - DO NOT TOUCH
  useEffect(() => {
    async function getChatHistoryFromDbAndRender() {
      if (!currentChatId) return;
      try {
        const chatDoc = await getDoc(doc(db, "chats", currentChatId));
        if (chatDoc.exists()) {
          const chatData = chatDoc.data();
          const storedMessages = JSON.parse(chatData.json || "[]");
          setChatHistory(storedMessages);
        }
      } 
      catch (error) {
        console.error("[CLIENT ERROR]: failed loading chat history: ", error);
      }
    };

    getChatHistoryFromDbAndRender();
  }, [currentChatId]); // Run when chat ID changes
  // Code works - DO NOT TOUCH

  // Code works - DO NOT TOUCH
  // Save chat history to localStorage whenever a new message is sent
  useEffect(() => {
    if (messages.length > 0) {
      // Merge new messages with existing ones, removing duplicates
      const updatedHistory = mergeMessages(chatHistory, messages);

      // Update local state
      setChatHistory(updatedHistory);
      setLocalMessages(updatedHistory); // If still needed for UI updates

      // Update Firebase
      setDoc(doc(db, "chats", currentChatId), {
        json: JSON.stringify(updatedHistory),
        user_uid: auth?.currentUser?.uid
      }).catch(error => {
        console.error("[CLIENT ERROR]: failed to update chat history: ", error);
      })

    }
  }, [messages]);
  // Code works - DO NOT TOUCH

  return (
    <ProtectedRoute loginUrl="/sign-in">
      
      <Toaster/>

      <ChatLayout>
        <Navbar />

        {/* Chat Messages */}
        <div className="flex flex-col w-full max-w-4xl mx-auto h-[78vh] overflow-y-auto px-2">
          
          {/* Render stored chat history first */}
          {localMessages.map((message, index) => (
            <div 
              key={`${message.id}-${index}`} 
              className={`whitespace-pre-wrap leading-tight mb-3 ${message.role === "user" ? "chat chat-end" : ""}`}
            >
              {message.parts.map((part: {type: string, text: string}, i: number) => {
                if (part.type === "text") {
                  return (
                    <ChatBubble 
                      key={i}
                      id={`${message.id}-${i}`}
                      role={message.role}
                      text={part.text}
                    />
                  );
                }
              })}
            </div>
          ))}

          {chatResponseIsLoading && <span className="loading loading-dots loading-xl"></span>}

          {/* Invisible div for scrolling */}
          <div ref={messagesEndRef} />
        </div>

        {errorMessage && <Bar variant="red" message={errorMessage} cn="max-w-4xl" />}
        <ChatForm
          handleSubmit={handleFormSubmit}
          input={input}
          handleInputChange={handleInputChange}
        />
        
        {/* {canModifyChat ? (
          <ChatForm
            handleSubmit={handleFormSubmit}
            input={input}
            handleInputChange={handleInputChange}
          />
        ) : (
          <div className="max-w-4xl mx-auto rounded-lg border bg-gray-50 border-gray-200 px-3 py-1.5 flex">
            <Eye strokeWidth="1.5" size="19" className="mt-[2px] me-2"/>
            This chat is in a read-only mode. You are not allowed to modify this chat.
          </div>
        )} */}
        
      </ChatLayout>
    </ProtectedRoute>
  );
}