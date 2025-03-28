"use client";

import SignOut from "@/components/auth/SignOut";
import { auth } from "@/lib/auth/firebase-client";
import { getUserChatHistory } from "@/lib/chats/chat";
import { truncateText } from "@/lib/utils";
import { LogOut, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatHistory {
  id: string;
  json: string;
  user_uid: string;
}

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [currentChatId, setCurrentChatId] = useState(searchParams.get("chat") || "");
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);

  useEffect(() => {
    async function loadUserChatHistory() {
      if (auth?.currentUser?.uid) {
        const userChats: ChatHistory[] = await getUserChatHistory(auth.currentUser.uid);
        setChatHistory(userChats);
      }
    }

    loadUserChatHistory();
  }, [auth.currentUser]); // Re-run when user logs in/out

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-5 h-screen pt-0 pb-0">
        {children}
      </div>

      <div className="drawer-side border border-t-0 border-l-0 border-b-0 border-r-gray-200">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="bg-white text-base-content min-h-full w-72 p-4">
          
          {/* App Name */}
          <li className="mb-3 flex text-xl font-serif mx-auto justify-center">
            <img src="/assets/imgs/lemon.png" alt="App Icon" className="w-7 h-7 me-2" />
            {process.env.NEXT_PUBLIC_APP_NAME}
          </li>

          {/* New Chat Button */}
          <li className="w-full mb-3 rounded-md cursor-pointer">
            <a href="/" className="k-btn-white w-full text-center flex justify-center">
              <Plus strokeWidth="1.5" size="19" className="mt-[2px] me-2" />
              New chat
            </a>
          </li>

          {/* Chat History */}
          {chatHistory.map((chat) => {
            let chatPreview = "No messages";

            try {
              const parsedJson = JSON.parse(chat.json);
              chatPreview = parsedJson[0]?.content ? truncateText(parsedJson[0].content, 35) : "Empty chat";
            } 
            catch (error) {
              console.error("[CLIENT ERROR]: Invalid chat JSON:", chat.json);
            }

            return (
              <li
                key={chat.id}
                className={`w-full hover:bg-gray-50 active:bg-gray-100 mb-3 rounded-md cursor-pointer flex justify-between ${
                  currentChatId === chat.id ? "bg-gray-100" : ""
                }`}
                onClick={() => setCurrentChatId(chat.id)}
              >
                <Link href={`?chat=${chat.id}`} className="px-3 py-2 block w-full text-sm">
                  {chatPreview}
                </Link>
              </li>
            );
          })}

          {/* Logout Button */}
          <li className="fixed bottom-0 mb-2 w-full">
            <a className="px-2 py-2 block w-full">
              <SignOut
                cn="px-3 py-2.5 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md flex"
                icon={<LogOut strokeWidth="1.5" size="19" className="mt-[2px] me-2" />}
              />
            </a>
          </li>

        </ul>
      </div>
    </div>
  );
}
