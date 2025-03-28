
import type { Metadata } from "next";
import Chat from "./(chat)/page.client";

export const metadata: Metadata = {
  title: "New chat",
  description: "Start a new chat",
};

export default function page() {
  return <Chat/>
}