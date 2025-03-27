import SignOut from "@/components/auth/SignOut";
import { truncateText } from "@/lib/utils";
import { LogOut, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [chatHistory, setChatHistory] = useState<{ chatId: string; message: string }[]>([]);
  // const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChats = JSON.parse(localStorage.getItem("chat_list") || "[]");
      setChatHistory(storedChats);
    }
  }, []);

  useEffect(() => {
    const updateChatHistory = () => {
      const storedChats = JSON.parse(localStorage.getItem("chat_list") || "[]");
      setChatHistory(storedChats);
    };

    window.addEventListener("storage", updateChatHistory);
    return () => window.removeEventListener("storage", updateChatHistory);
  }, []);

  const handleDeleteChat = (chatId: string) => {
    const updatedChats = chatHistory.filter(chat => chat.chatId !== chatId);
    setChatHistory(updatedChats);
    localStorage.setItem("chat_list", JSON.stringify(updatedChats));
    
    // If the deleted chat is currently viewed, redirect to the main page
    const currentUrlParams = new URLSearchParams(window.location.search);
    if (currentUrlParams.get("chat") === chatId) {
      // router.push("/");
      (window as any).location.href = "/"; // Force refresh to clear messages states on the chat area
    }
  };

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content p-5 h-screen pt-0 pb-0">
        {children}
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side border border-t-0 border-l-0 border-b-0 border-r-gray-200">
        <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="bg-gray-5 text-base-content min-h-full w-72 p-4">
          {/* App Title */}
          <li className="mb-3">
            <span className="flex text-xl font-serif mx-auto justify-center">
              <img 
                src="/assets/imgs/lemon.png" 
                alt={`${process.env.NEXT_PUBLIC_APP_NAME} icon`} 
                className="w-7 h-7 me-2"
              />
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </li>

          {/* New Chat Button */}
          <li className="w-full mb-3 rounded-md cursor-pointer">
            <a href="/" className="k-btn-white w-full text-center flex justify-center">
              <Plus strokeWidth="1.5" size="19" className="mt-[2px] me-2"/>
              New chat
            </a>
          </li>

          {/* Chat History */}
          {chatHistory.map((chat) => (
            <li 
              key={chat.chatId} 
              className="w-full hover:bg-gray-50 active:bg-gray-100 mb-3 rounded-md cursor-pointer flex justify-between"
            >
              <Link href={`?chat=${chat.chatId}`} className="px-3 py-2 block w-full">
                {truncateText(chat.message, 20) || "New Chat"}
              </Link>
              <button 
                type="button" 
                onClick={() => {
                  handleDeleteChat(chat.chatId);
                }} className="mt-0 me-2 cursor-pointer">
                <Trash2 strokeWidth="1.5" size="19" className="hover:text-red-700"/>
              </button>
            </li>
          ))}

          {/* Logout Button */}
          <li className="fixed bottom-0 mb-2">
            <a className="px-2 py-2 block w-full">
              <SignOut
                cn="px-3 py-2.5 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md flex"
                icon={<LogOut strokeWidth="1.5" size="19" className="mt-[2px] me-2"/>}
              />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}