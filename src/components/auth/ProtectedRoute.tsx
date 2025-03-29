"use client"

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Unsubscribe, User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/auth/firebase-client";

export default function ProtectedRoute(
  { children, loginUrl } : 
  { children: React.ReactNode, loginUrl: string }
) {
  // const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const router = useRouter();

  const [user, setUser] = useState<User>();

  // useEffect(() => {
  //   // setTimeout(() => {
  //   const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setIsAuthenticated(true);
  //       setUser(user);
  //     }
  //     else {
  //       setIsAuthenticated(false);
  //       router.push(loginUrl);
  //     }
  //     // setLoading(false);
  //   });
  //   return () => unsubscribe();
  // // }, 2000);
  // }, [router]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUser(user);

        try {
          // await user.getIdToken(true); // Force refresh token
          // console.log("[CLIENT LOG]: setting token to localStorage");
          localStorage.setItem("token", await user.getIdToken(true));
        } 
        catch (error) {
          console.error("[CLIENT ERROR]: error refreshing token: ", error);
        }
      }
      else {
        setIsAuthenticated(false);
        router.push(loginUrl);
      }
    });

    return () => unsubscribe();
}, [router]);

  // if (loading) {
  //   return <p>Loading...</p>;
  // }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};