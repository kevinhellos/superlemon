"use client";

import { getCurrentUser } from "@/lib/auth/auth-client";
import { useEffect } from "react";

export default function UserProvider(
  { children, setUser, setToken } : 
  { children: React.ReactNode, setUser: any, setToken: any }
) {

  useEffect(() => {
    (async () => {
      const { user, idToken } = await getCurrentUser();
      setUser(user);
      setToken(idToken);
    })();
  }, []);  

  return children;
}
