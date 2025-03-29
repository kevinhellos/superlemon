import { LogOut, PanelLeftDashed, UserCog } from "lucide-react";
import SignOut from "../auth/SignOut";
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

        <span className="bg-sky-100 text-sky-700 px-3.5 py-2 rounded-full text-sm flex font-medium h-9 mt-1">
          <UserCog strokeWidth="1.5" size="19" className="me-2"/>
          BETA user
        </span>

        <SignOut
          cn="px-3 py-2.5 hover:bg-red-50 hover:text-red-700 cursor-pointer rounded-md flex ms-2"
          icon={<LogOut strokeWidth="1.5" size="19" className="mt-[2px]" />}
          hideText={true}
        />

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
