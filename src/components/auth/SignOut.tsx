"use client";

import { logOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut(
  { afterSignOutUrl, cn, icon } : 
  { afterSignOutUrl?: string, cn?: string, icon?: React.ReactNode }
) {

  const router = useRouter();

  async function handleSignOut() {
    await logOut();
    localStorage.removeItem("token");
    
    if (afterSignOutUrl !== undefined) {
      router.push(afterSignOutUrl);
    }
    
  }

  return (
    <button 
      type="button" 
      className={cn ? cn : "k-btn-white flex mt-5"}
      onClick={handleSignOut}
    >
      {icon && icon}
      Sign out
    </button>
  )
}