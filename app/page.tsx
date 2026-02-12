"use client"

import { supabase } from "@/lib/supabaseClient"

export default function Home() {

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard"
      }
    })
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={signIn}
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Sign in with Google
      </button>
    </div>
  )
}
