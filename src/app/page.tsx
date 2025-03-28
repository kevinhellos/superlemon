import ChatPage from "./(chat)/ChatPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New chat",
  description: "Start a new chat",
};

export default function page() {
  return <ChatPage/>
}