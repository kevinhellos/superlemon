import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/auth/firebase-client";

export async function getUserChatHistory(userUid: string) {
  try {
    const chatsRef = collection(db, "chats"); // Reference the "chats" collection
    const q = query(chatsRef, where("user_uid", "==", userUid)); // Query by user_uid

    const querySnapshot = await getDocs(q);
    let chats: any = [];

    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id, // Chat ID
        ...doc.data(), // Other chat data (json, user_uid)
      });
    });

    return chats; // Return the array of chat objects
  } 
  catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}