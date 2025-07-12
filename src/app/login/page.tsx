"use client";

import { useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    } else if (status === "unauthenticated") {
      // Do nothing, show login UI
    }
  }, [status, router]);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/stars-bg.png')",
      }}>
      <div className="w-full max-w-md bg-white bg-opacity-95 rounded-2xl shadow-2xl flex flex-col items-center">
        <div className="w-full flex flex-col items-center pt-6 pb-2 border-b">
          <span className="text-3xl mb-2"><span role='img' aria-label='crystal ball'>🔮</span></span>
          <h1 className="text-3xl font-bold text-purple-700">Tarot AI</h1>
        </div>
        <div className="flex-1 flex flex-col justify-center items-center w-full px-8 py-10">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-blue-700 text-lg font-semibold transition-all"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
