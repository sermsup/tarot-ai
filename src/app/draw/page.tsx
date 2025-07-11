"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import tarotCardsData from "../../data/tarot-cards.json";

type TarotCard = {
  name: string;
  image: string;
  meaning: string;
  meaning_th: string;
};

// Helper to randomly pick 3 unique cards
function drawThreeCards(cards: TarotCard[]): TarotCard[] {
  const picked: TarotCard[] = [];
  const used = new Set<number>();
  while (picked.length < 3) {
    const idx = Math.floor(Math.random() * cards.length);
    if (!used.has(idx)) {
      picked.push(cards[idx]);
      used.add(idx);
    }
  }
  return picked;
}

export default function DrawPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const question = searchParams.get("q") || "";
  const [cards, setCards] = useState<TarotCard[]>([]);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Draw cards on mount
    const drawn = drawThreeCards(tarotCardsData as TarotCard[]);
    setCards(drawn);
    if (question && drawn.length === 3) {
      getPrediction(question, drawn);
    }
    // eslint-disable-next-line
  }, []);

  async function getPrediction(question: string, drawnCards: TarotCard[]) {
    setLoading(true);
    setError("");
    setPrediction("");
    const prompt = `User question: ${question}\n\nCards:\n${drawnCards
      .map(
        (c: TarotCard, i: number) =>
          `${i + 1}. ${c.name} - ${c.meaning} (${c.meaning_th})`
      )
      .join("\n")}\n\nGive a detailed tarot reading in English and Thai.`;
    try {
      const res = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setPrediction(data.result || data.prediction || "No prediction.");
    } catch (e) {
      setError("Error contacting AI service.");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4 py-10" style={{ backgroundImage: "url('/images/tarot-decor.png')" }}>
      <div className="max-w-2xl w-full bg-white bg-opacity-80 backdrop-blur-md rounded-2xl p-8 shadow-xl text-center">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">🔮 Your Tarot Reading</h1>
        {question && <p className="mb-6 text-lg text-purple-700">Your question: <span className="font-semibold">{question}</span></p>}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center mb-8">
          {cards.map((card, idx) => (
            <div key={card.name} className="flex flex-col items-center">
              <img src={card.image} alt={card.name} className="w-32 h-52 object-cover rounded-xl shadow-md mb-2" />
              <div className="font-bold text-purple-700">{card.name}</div>
              <div className="text-sm text-gray-700">{card.meaning}</div>
              <div className="text-xs text-gray-500">{card.meaning_th}</div>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-purple-800 mb-4">AI Prediction</h2>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative flex items-center justify-center mb-4">
                <span className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin shadow-lg"></span>
                <span className="absolute w-24 h-24 bg-purple-200 opacity-30 rounded-full blur-xl animate-pulse"></span>
              </div>
              <div className="text-purple-700 font-medium text-lg animate-pulse">Consulting the Tarot...</div>
            </div>
          ) : error ? (
            <div className="text-red-600">{error}</div>
          ) : (
            <div className="whitespace-pre-line text-gray-800 bg-purple-50 rounded-xl p-4 border border-purple-200 shadow-sm min-h-[80px]">
              {prediction}
            </div>
          )}
        </div>
        <button
          className="mt-8 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-base font-medium transition-all"
          onClick={() => router.push("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
