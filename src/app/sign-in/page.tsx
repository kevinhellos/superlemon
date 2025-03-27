import SignIn from "@/components/auth/SignIn";
import Bar from "@/components/bar/Bar";
import type { Metadata } from "next";
 
export const metadata: Metadata = {
  title: "Sign in | SuperLemon",
  description: "Sign in to continue",
}

export default function page() {
  return (
    <>

      <Bar
        variant="blue"
        message="SuperLemon is currently in BETA program. It is only available for BETA testers and administrators."
        cn="text-center py-3"
      />

      <SignIn
        appName={process.env.NEXT_PUBLIC_APP_NAME}
        provider="Email"
        afterSignInUrl="/"
      />
    </>
  )
}
