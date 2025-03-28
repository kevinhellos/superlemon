import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
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

    // Fallback sorting (like Firestore default order)
    // chats.reverse(); // Reverse array to get latest on top

    return chats; // Return the array of chat objects
  } 
  catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

export async function deleteChat(chatId: string){
  try {
    await deleteDoc(doc(db, "chats", chatId));
  }
  catch (error) {
    console.error("Error deleting chats: ", error);
  }
}