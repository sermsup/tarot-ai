"use client";

import { useEffect } from 'react';
import { signIn } from "next-auth/react";

export default function LoginPage() {
  useEffect(() => {
    signIn("google", {
      prompt: "login",
    });
  }, []);

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/stars-bg.png')",
      }}>
      <button
        onClick={() => signIn("google")}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-600"
      >
        Sign in with Google
      </button>
    </div>
  );
}
