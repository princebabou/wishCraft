"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Wind } from 'lucide-react';
import './page.css'

interface CardData {
  slug: string;
  name: string;
  age: number;
  message: string;
}

export default function BirthdayCard() {
  const { slug } = useParams();
  const [cardData, setCardData] = useState<CardData>({ slug: "", name: "", age: 0, message: "" });
  const [isBlown, setIsBlown] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const emojis = ["🎈", "🎂", "🎁", "🎉", "🎊"];

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let microphone: MediaStreamAudioSourceNode;

    const startListening = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const checkBlowing = () => {
          analyser.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

          if (average > 100) {
            setIsBlown(true);
            setIsListening(false);
          } else if (isListening) {
            requestAnimationFrame(checkBlowing);
          }
        };

        checkBlowing();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };

    if (isListening) {
      startListening();
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isListening]);

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/card?slug=${slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch card data");
        }
        const data = await response.json();
        setCardData(data.card);
      } catch (err) {
        setError("Failed to load birthday card. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (slug) {
      fetchCardData();
    }
  }, [slug]);

  if (isLoading) {
    return (
      <div className="loading flex flex-col justify-center items-center h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
        <svg
          viewBox="0 0 187.3 93.7"
          height="100px"
          width="200px"
          className="svgbox animate-pulse"
        >
          <defs>
            <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
              <stop stopColor="pink" offset="0%"></stop>
              <stop stopColor="purple" offset="50%"></stop>
              <stop stopColor="indigo" offset="100%"></stop>
            </linearGradient>
          </defs>
          <path
            stroke="url(#gradient)"
            strokeWidth="4"
            fill="none"
            d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z"
          ></path>
        </svg>
        <div className="bg-white p-4 rounded-lg shadow-xl animate-bounce mt-4">
          <p className="text-xl font-bold text-purple-600">Baking your card... 🎂</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 p-4 rounded-lg shadow-xl mt-32 w-80 flex items-center justify-center h-screen">
        <p className="text-xl font-bold text-white">404 | Not Found 😿</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Emoji Background */}
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute text-4xl animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            opacity: 0.3,
          }}
        >
          {emojis[Math.floor(Math.random() * emojis.length)]}
        </div>
      ))}

      <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full text-center relative overflow-hidden">
        <h1 className="text-4xl font-bold mb-4 text-gray-400">
          Happy Birthday, {cardData.name}!
        </h1>
        <p className="text-2xl text-purple-400 mb-6 font-semibold">You &apos;re {cardData.age} years old today!🤭</p>
        
        {/* Candles */}
        <div className="relative mb-8">
          <div className="flex justify-center space-x-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="relative">
                <div
                  className={`w-4 h-16 bg-yellow-300 rounded-full ${
                    isBlown ? "animate-fadeout" : "animate-flicker"
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 bg-orange-500 rounded-full absolute top-0 left-1 ${
                    isBlown ? "hidden" : "animate-flame"
                  }`}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {!isBlown ? (
          <div>
            <p className="text-xl mb-4 text-gray-600">
              Blow out the candles to reveal your message!
            </p>
            <button
              onClick={() => setIsListening(true)}
              className="bg-gray-400 text-white rounded-md py-2 px-4 hover:bg-purple-500 transition-all duration-300 transform hover:scale-105"
            >
              {isListening ? (
                <Wind className="animate-flicker inline-block mr-2" size={24} />
              ) : (
                "Start Blowing"
              )}
            </button>
          </div>
        ) : (
          <div className="animate-fadein">
            <p className="text-xl mb-4 text-purple-700 font-mono">✨Your special message✨</p>
            <div className="bg-yellow-100 p-6 rounded-lg shadow-inner transform rotate-1 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full border-t border-b border-blue-300 opacity-50" style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 27px, #9ca3af 28px)" }}></div>
              <p className="text-2xl font-handwriting text-purple-800 relative z-10 transform -rotate-1">
                {cardData.message}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
