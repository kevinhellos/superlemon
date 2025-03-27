"use client";

import UserProvider from "@/components/auth/UserProvider";
import SignOut from "@/components/auth/SignOut";
import { User } from "firebase/auth";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { HttpFetch } from "@/lib/http/http";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
}

export default function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function fetchProducts() {
    const products = await HttpFetch({
      url: "/api/products",
      method: "GET",
      authorizationToken: localStorage.getItem("token")!
    });
    setProducts(products);
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProtectedRoute loginUrl="/">
      <UserProvider
        setUser={setUser}
        setToken={setToken}
      >

        <h2 className="text-2xl mt-5">Welcome, {user?.displayName || "Guest"}</h2>
        <pre>{JSON.stringify(products, null, 1)}</pre>
        <SignOut afterSignOutUrl="/" />

      </UserProvider>
    </ProtectedRoute>
  );
}