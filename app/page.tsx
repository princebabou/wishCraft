"use client";

import React, { useState, useRef, useEffect } from "react";
import { FaUser, FaBirthdayCake, FaComment, FaLink, FaCopy } from 'react-icons/fa';
import './card/[slug]/page.css'

interface BackgroundEmojiProps {
  emoji: string;
  style: React.CSSProperties;
}

const BackgroundEmoji: React.FC<BackgroundEmojiProps> = ({ emoji, style }) => (
  <div 
    style={{
      position: 'absolute',
      fontSize: '6rem',
      opacity: 1,
      ...style
    }}
  >
    {emoji}
  </div>
);

export default function Home() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [message, setMessage] = useState("");
  const [slug, setSlug] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [shareableLink, setShareableLink] = useState("");
  const [copyFeedback, setCopyFeedback] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedSlug = slug || `${name.toLowerCase().replace(/\s+/g, "-")}-${age}`;
    
    setIsAnimating(true);
  
    try {
      const response = await fetch('/api/card', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: generatedSlug,
          name,
          age,
          message,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(`Failed to save card data: ${data.error || response.statusText}`);
      }
  
      const link = `${window.location.origin}/card/${generatedSlug}`;
      setShareableLink(link);
  
      setTimeout(() => {
        setIsAnimating(false);
        setShowPopup(true);
      }, 1500);
    } catch (error) {
      console.error('Error saving card data:', error);
      alert(`Error saving card data: ${error instanceof Error ? error.message : String(error)}`);
      setIsAnimating(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableLink);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleClose = () => {
    setShowPopup(false);
    // Reset form
    setName("");
    setAge("");
    setMessage("");
    setSlug("");
    if (formRef.current) formRef.current.reset();
  };

  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showPopup]);

  return (
    <main className="min-h-screen bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 relative overflow-hidden">
      <style jsx global>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
      <div className="absolute inset-0 overflow-hidden">
        <BackgroundEmoji emoji="🎈" style={{ top: '5%', left: '5%', animationDelay: '0s' }} />
        <BackgroundEmoji emoji="🎁" style={{ top: '10%', right: '10%', animationDelay: '1s' }} />
        <BackgroundEmoji emoji="🎂" style={{ bottom: '15%', left: '15%', animationDelay: '2s' }} />
        <BackgroundEmoji emoji="🎉" style={{ bottom: '10%', right: '5%', animationDelay: '3s' }} />
        <BackgroundEmoji emoji="🧁" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', animationDelay: '4s' }} />
      </div>
      <div className="absolute top-4 left-4 flex items-center space-x-2">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white cursor-pointer hover:text-purple-800 transition-colors duration-300" onClick={() => window.location.reload()}>
          Wish<span className="text-purple-800 font-extrabold">Craft<span className="animate-bounce inline-block">🎉</span></span>
        </h2>
      </div>
      <div className={`bg-white rounded-lg shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-sm sm:max-w-md md:max-w-lg transition-all duration-500 ${isAnimating ? 'scale-75 opacity-0 rotate-12' : 'scale-100 opacity-100 rotate-0'} relative z-10`}>
        <h1 className="font-bold mb-6 sm:mb-8 text-center text-purple-600 text-xl sm:text-2xl leading-tight">
          Create a magical birthday moment! <span className="block mt-2 text-base sm:text-lg text-gray-600"> Enter the birthday person's name, age, and a custom message that will
          appear after they blow out their candles. You can also customize the
          URL slug. If you leave it empty, we'll make one for you 🎁</span>
        </h1>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 text-black">
          <div className="relative group">
            <FaUser className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Birthday Star's Name"
              required
              className="block w-full pl-12 pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-300"
            />
          </div>
          <div className="relative group">
            <FaBirthdayCake className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
              placeholder="Candles on the Cake as in Age"
              className="block w-full pl-12 pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-300"
            />
          </div>
          <div className="relative group">
            <FaComment className="absolute top-4 left-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder="Your Birthday Message"
              className="block w-full pl-12 pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-300 min-h-[80px] sm:min-h-[100px] resize-none"
            ></textarea>
          </div>
          <div className="relative group">
            <FaLink className="absolute top-1/2 transform -translate-y-1/2 left-4 text-gray-400 group-focus-within:text-purple-500 transition-colors duration-300" />
            <input
              type="text"
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Slug (optional)"
              className="block w-full pl-12 pr-4 py-2 sm:py-3 text-base sm:text-lg rounded-lg border-2 border-gray-300 bg-white shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 transition-all duration-300"
            />
          </div>
  
          <button
            type="submit"
            className="w-full bg-purple-600 text-white text-base sm:text-lg font-semibold rounded-lg py-2 sm:py-3 px-4 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
          >
            Create Birthday Card ✨
          </button>
        </form>
      </div>
      
      {isAnimating && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 z-50 p-4">
        <div className="loading flex justify-center items-center mb-4">
          <svg
            viewBox="0 0 187.3 93.7"
            className="w-40 h-20 sm:w-56 sm:h-28 md:w-64 md:h-32"
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
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-xl animate-bounce">
          <p className="text-sm sm:text-base md:text-xl font-bold text-purple-600">
            Creating your birthday card... 🎂
          </p>
        </div>
      </div>
      )}

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl max-w-xs sm:max-w-sm md:max-w-md w-full transform transition-all duration-300 scale-100 opacity-100">
            <h2 className="text-xl sm:text-2xl font-bold text-purple-600 mb-4">Your Birthday Card is Ready! 🎉</h2>
            <p className="mb-4 text-sm sm:text-base text-gray-600">Share this link with the birthday person 💝</p>
            <div className="flex items-center mb-4 relative">
              <input
                type="text"
                value={shareableLink}
                readOnly
                className="flex-grow p-2 border rounded-l-md pr-10 text-gray-500 text-sm sm:text-base overflow-x-auto"
              />
              <button
                onClick={handleCopy}
                className="bg-purple-600 text-white p-2 sm:p-3 rounded-r-md hover:bg-purple-700 transition-colors duration-300"
              >
                <FaCopy />
              </button>
              {copyFeedback && (
                <span className="absolute bg-purple-500 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md text-xs sm:text-sm animate-fade-in-out left-1/2 transform -translate-x-1/2 -top-8">
                  Copied! 🎊
                </span>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-purple-600 text-white rounded-md py-2 px-4 text-sm sm:text-base hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <footer className="mt-4 text-sm sm:text-base text-white relative z-10">made with 💝</footer>
    </main>
  );
}