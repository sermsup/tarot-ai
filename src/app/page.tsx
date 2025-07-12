'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/dist/client/components/navigation';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const { data: session } = useSession();
  const [question, setQuestion] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [askedQuestion, setAskedQuestion] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [credit, setCredit] = useState<number|null>(null);
  const [showCreditAlert, setShowCreditAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchCredit(email: string) {
      const res = await fetch(`/api/user-credit?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      setCredit(data.credit);
    }
    if (session?.user?.email) {
      fetchCredit(session.user.email);
    }
  }, [session?.user?.email]);

  const handleAsk = async () => {
    if (!question.trim()) {
      setShowAlert(true);
      return;
    }
    if (session?.user?.email) {
      try {
        const res = await fetch(`/api/user-credit?email=${encodeURIComponent(session.user.email)}`);
        const data = await res.json();
        if (typeof data.credit === 'number' && data.credit < 5) {
          setShowCreditAlert(true);
          return;
        }
      } catch (e) {
        setShowCreditAlert(true);
        return;
      }
    }
    setAskedQuestion(question);
    setShowModal(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage: "url('/images/tarot-decor.png')",
      }}
    >
      <div className="max-w-lg w-full bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">🔮 Tarot AI</h1>

        {/* Modal Popup */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-3xl font-bold focus:outline-none"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" fill="none" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 9l6 6m0-6l-6 6" />
                </svg>
              </button>
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Your Question</h2>
              <div className="flex flex-col items-center mb-6">
                <span className="text-base text-purple-500 font-semibold mb-1 tracking-wide uppercase">You asked</span>
                <span className="text-lg text-gray-800 font-medium italic bg-purple-50 px-4 py-2 rounded-xl border border-purple-200 shadow-sm">"{askedQuestion}"</span>
              </div>
              <button
                onClick={async () => {
                  if (!session?.user?.email) return;
                  // Reduce credit by 5 before navigating
                  try {
                    const res = await fetch('/api/user-credit', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: session.user.email, amount: 5 })
                    });
                    const data = await res.json();
                    if (res.ok) {
                      setShowModal(false);
                      router.push(`/draw?q=${encodeURIComponent(question)}`);
                    } else {
                      setShowModal(false);
                      setShowCreditAlert(true);
                    }
                  } catch {
                    setShowModal(false);
                    setShowCreditAlert(true);
                  }
                }}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base font-medium transition-all"
              >
                Predict your horoscope
              </button>
            </div>
          </div>
        )}

        {/* Alert Modal Popup */}
        {showAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Please enter a question</h2>
              <p className="text-base text-gray-700 mb-6">กรุณากรอกคำถามของคุณก่อนดำเนินการต่อ</p>
              <button
                onClick={() => setShowAlert(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Credit Alert Modal Popup */}
        {showCreditAlert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative">
              <h2 className="text-2xl font-bold text-red-600 mb-4">Not enough credit</h2>
              <p className="text-base text-gray-700 mb-6">You do not have enough credit to ask the cards.</p>
              <button
                onClick={() => setShowCreditAlert(false)}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {session ? (
          <>
            <p className="text-gray-700 mb-4">
              Welcome, <span className="font-medium">{session.user?.name}</span>
              {credit !== null && (
                <span className="ml-2 text-purple-700">(Credit: {credit})</span>
              )}
            </p>
            <div className="mt-8"></div>
            <input
              type="text"
              placeholder="Type your question..."
              className="w-full p-3 border border-purple-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-800 mb-3"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Or select a popular question:</p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-base"
                  onClick={() => setQuestion('Ask about your horoscope about your job.')}
                >
                  1. Ask about your horoscope about your job.
                </button>
                <button
                  type="button"
                  className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-base"
                  onClick={() => setQuestion('Ask about your life by taking a horoscope.')}
                >
                  2. Ask about your life by taking a horoscope.
                </button>
                <button
                  type="button"
                  className="w-full py-2 bg-purple-100 hover:bg-purple-200 text-purple-800 rounded-lg text-base"
                  onClick={() => setQuestion('Horoscope exam asking about love.')}
                >
                  3. Horoscope exam asking about love.
                </button>
              </div>
            </div>
            <button
              onClick={handleAsk}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-lg font-medium transition-all"
            >
              Ask the Cards
            </button>
            <div className="mt-6"></div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="mt-4 text-sm text-gray-500 hover:underline"
            >
              Sign out
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn('google', { prompt: 'login' })}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-lg font-medium"
          >
            Sign in with Google
          </button>
        )}
      </div>
    </div>
  );
}
