import { collection, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/auth/firebase-client";
import { Chat } from "@/models";

export async function getUserChatHistory(userUid: string) {
  try {
    const chatsRef = collection(db, "chats"); // Reference the "chats" collection
    const querySnapshot = await getDocs(query(chatsRef, where("user_uid", "==", userUid)));
    
    let chats: Chat[]= [];

    querySnapshot.forEach((doc) => {
      chats.push({
        id: doc.id,
        json: doc.data().json,
        user_uid: doc.data().user_uid,
      });
    });

    // Fallback sorting (like Firestore default order)
    // chats.reverse(); // Reverse array to get latest on top
    return chats; // Return the array of chat objects
  } 
  catch (error) {
    console.error("[CLIENT ERROR]: error fetching user chats: ", error);
    return [];
  }
}

export async function deleteChat(chatId: string){
  try {
    await deleteDoc(doc(db, "chats", chatId));
  }
  catch (error) {
    console.error(`[CLIENT ERROR]: error deleting chat with chat id: ${chatId}\n`, error);
  }
}