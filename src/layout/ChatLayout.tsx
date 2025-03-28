"use client";

import SignOut from "@/components/auth/SignOut";
import { auth } from "@/lib/auth/firebase-client";
import { deleteChat, getUserChatHistory } from "@/lib/chats/chat";
import { truncateText } from "@/lib/utils";
import { Chat } from "@/models";
import { LogOut, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const [currentChatId, setCurrentChatId] = useState(searchParams.get("chat") || "");
  const [chatHistory, setChatHistory] = useState<Chat[]>([]);

  async function loadUserChatHistory() {
    if (auth?.currentUser?.uid) {
      const userChats: Chat[] = await getUserChatHistory(auth.currentUser.uid);
      setChatHistory(userChats);
    }
  }

  useEffect(() => {
    loadUserChatHistory();
  }, [auth.currentUser]); // Re-run when user logs in/out

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content p-5 h-screen pt-0 pb-0">
          {children}
        </div>

        <div className="drawer-side border border-t-0 border-l-0 border-b-0 border-r-gray-200">
          <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
          <ul className="bg-white text-base-content min-h-full w-72 p-4">
            
            {/* App Name */}
            <li className="mb-3 sticky top-0 bg-white">
              <Link href="/" className=" text-xl font-serif flex mx-auto justify-center mb-3">
                <img src="/assets/imgs/lemon.png" alt="App Icon" className="w-7 h-7 me-2" />
                {process.env.NEXT_PUBLIC_APP_NAME}
              </Link>

              <a href="/" className="k-btn-white w-full text-center flex justify-center">
                <Plus strokeWidth="1.5" size="19" className="mt-[2px] me-2" />
                New chat
              </a>
            </li>

            {/* Chat History */}
            {chatHistory.map((chat: Chat) => {
              let chatPreview = "No messages";

              try {
                const parsedJson = JSON.parse(chat.json);
                chatPreview = parsedJson[0]?.content ? truncateText(parsedJson[0].content, 30) : "Empty chat";
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
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    // (window as any).document.title = chatPreview;
                  }}
                >
                  <Link href={`?chat=${chat.id}`} className="px-3 py-2 block w-full text-sm">
                    {chatPreview}
                  </Link>
                  <button
                    type="button"
                    className="px-2 cursor-pointer"
                    onClick={async () => {
                      let chatIdToDelete = chat.id;
                      await deleteChat(chatIdToDelete)
                      .then(() => {
                        toast("Chat deleted")

                        // Force redirect to / to clear messages in the chatbox
                        if (chatIdToDelete === searchParams.get("chat")) {
                          window.location.href = "/";
                        }
                        
                        loadUserChatHistory();
                      })
                    }}
                  >
                    <Trash2 strokeWidth="1.5" size="19" className="text-gray-300 hover:text-red-700"/>
                  </button>
                </li>
              );
            })}

            {/* Logout Button */}
            <li className="fixed bottom-0 mb-2 w-full bg-white">
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
    </>
  );
}
