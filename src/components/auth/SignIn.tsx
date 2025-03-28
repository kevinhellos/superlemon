"use client";

import { signInWithGoogle } from "@/lib/auth/auth-client";
import { auth } from "@/lib/auth/firebase-client";
import { onAuthStateChanged, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AuthProvider = "Google"| "Email" | "Hybrid";

export default function SignIn(
    { appName, provider, afterSignInUrl } : 
    { appName?: string, provider: AuthProvider, afterSignInUrl: string }) {

    const router = useRouter();

    async function handleGoogleSignIn() {
        try {
          const { user, idToken } = await signInWithGoogle();
          if (user) {
            localStorage.setItem("token", idToken);
            router.push(afterSignInUrl);
          }
        } 
        catch (error: any) {
          console.error("Sign-in error: ", error.message);
        }
    };

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isSigningIn, setIsSigningIn] = useState(false);

    async function handleEmailSignIn() {
        setIsSigningIn(true);
        setErrorMessage("");
        try {
            if (email.trim() !== "" && password.trim() !== "") {
                const { user } = await signInWithEmailAndPassword(auth, email, password);
                if (user) {
                    setErrorMessage("");
                    localStorage.setItem("token", await user.getIdToken());
                    router.push(afterSignInUrl);
                }
            }
            else {
                setIsSigningIn(false);
                setErrorMessage("Email and password are required.");
            }
        } 
          catch (error: any) {
            console.error(error);
            setIsSigningIn(false);
            if (error.message.includes("auth/invalid-credential")) {
                setErrorMessage("Invalid email or password.");
            }
            else {
                setErrorMessage("Failed to authenticate");
            }
            // setErrorMessage(error.message);
            console.error("Sign-in error: ", error.message);
        }
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Always redirect user to the afterSignInUrl if they visited/ re-visit
                // the sign-in page after signing in
                router.push(afterSignInUrl);
            } 
            else {
                localStorage.removeItem("token");
            }
        });
        return () => unsubscribe();
    }, []);

    // useEffect(() => {
    //     const unsubscribe = onAuthStateChanged(auth, async (user) => {
    //         if (user) {
    //             try {
    //                 await user.getIdToken(true); // Force refresh token
    //                 router.push(afterSignInUrl);
    //             } catch (error) {
    //                 console.error("Error refreshing token:", error);
    //             }
    //         }
    //     });

    //     return () => unsubscribe();
    // }, [router]);

    return (
        <div className="mx-auto mt-[15vh] max-w-md overflow-auto p-10 shadow-xs border border-gray-200 rounded-md">
            <h2 className="text-xl text-center font-serif">
                {appName ? `${appName}` : "Sign in"}
            </h2>
            <p className="text-center text-gray-500 mb-5 text-sm">Please sign in to continue</p>

            {(provider === "Email" || provider === "Hybrid") && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleEmailSignIn();
                }}>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="text" 
                        name="email"
                        className="k-input w-full mb-5"
                        placeholder="E.g. someone@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        name="password"
                        className="k-input w-full mb-5"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {errorMessage && <span className="block text-red-700 mb-5">{errorMessage}</span>}

                    <button 
                        type="submit" 
                        className="k-btn-black float-end mb-5 w-full"
                        disabled={isSigningIn}
                    >
                        {isSigningIn && <span className="loading loading-spinner loading-xs me-2"></span>}
                        Sign in
                    </button>
                </form>
            )}

            {(provider === "Google" || provider === "Hybrid") && (
                <button 
                    type="button" 
                    className="k-btn-white mx-auto w-full flex justify-center"
                    onClick={handleGoogleSignIn}
                >
                    <img
                        src="/assets/imgs/google.png"
                        alt="Google icon"
                        className="w-6 h-6 me-2"
                    />
                    Continue with Google
                </button>
            )}


        </div>
    )
}
