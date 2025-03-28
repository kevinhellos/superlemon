import { PanelLeftDashed, UserCog } from "lucide-react";
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
