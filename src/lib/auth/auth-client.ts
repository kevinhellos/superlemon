import { User, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "./firebase-client";

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const idToken = await result.user.getIdToken();
    return { user: result.user, idToken }; // Return the token
  } 
  catch (error: any) {
    throw new Error("Google Sign-In failed: " + error.message);
  }
}

export async function logOut() {
  try {
    await signOut(auth);
  } 
  catch (error: any) {
    throw new Error("Failed to sign out: " + error.message);
  }
}
export function getCurrentUser(): Promise<{ user: User | null; idToken: string | null }> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        localStorage.setItem("token", idToken);
        resolve({ user, idToken });
      } 
      else {
        localStorage.removeItem("token");
        resolve({ user: null, idToken: null });
      }
      unsubscribe(); // Cleanup listener
    });
  });
}