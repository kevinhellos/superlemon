"use client";

import { logOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";

export default function SignOut(
  { afterSignOutUrl, cn, icon, hideText } : 
  { afterSignOutUrl?: string, cn?: string, icon?: React.ReactNode, hideText?: boolean }
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
      {hideText ? "" : "Sign out"}
    </button>
  )
}