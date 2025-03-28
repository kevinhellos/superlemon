"use client";
import { Crown, PanelLeftDashed, Trash2, UserCog } from "lucide-react";
// import { useRouter } from "next/navigation";

export default function Navbar() {

  // const router = useRouter();

  return (
    <div className="navbar">
      <div className="flex-1">
        <label htmlFor="my-drawer-2" className="k-btn-white flex w-fit drawer-button lg:hidden">
          <PanelLeftDashed
          strokeWidth="1.5" size="19"
          />
        </label>
      </div>
      <div className="flex">
        {/* <button 
          type="button" 
          className={`
            bg-white border border-gray-200 shadow-sm px-3.5 py-2 rounded-full text-sm flex font-medium h-9
            active:bg-gray-100 cursor-pointer me-3 hover:text-red-700 hover:bg-red-50 hover:border-red-700
          `}
          onClick={() => {
            // localStorage.removeItem("chat_history");
            const chat_list = JSON.parse(localStorage.getItem("chat_list")!);
            for (let index in chat_list) {
              localStorage.removeItem(`chat_${chat_list[index]["chatId"]}`);
            }
            localStorage.removeItem("chat_list");
            // router.refresh();
            (window as any).location.href = "/"; // Force to / url incase it was on a specific chat page ?chat=xxxxxx
          }}
        >
          <Trash2 strokeWidth="1.5" size="19" className="me-2"/>
          Clear all chat history
        </button> */}

        <span className="bg-sky-100 text-sky-700 px-3.5 py-2 rounded-full text-sm flex font-medium h-9">
          <UserCog strokeWidth="1.5" size="19" className="me-2"/>
          BETA user
        </span>

        {/* <span className="bg-purple-100 text-purple-700 px-3.5 py-2 rounded-full text-sm flex font-medium h-9">
          <Crown strokeWidth="1.5" size="19" className="me-2"/>
          Premium
        </span> */}
        {/* <span className="border border-gray-200 px-3.5 py-2 rounded-full text-sm flex font-medium">
          Free plan
        </span> */}

      </div>
    </div>
  )
}
