import React, { useState, useEffect } from "react";

interface Bubble {
  id: number;
  size: number;
  left: number;
  animationDuration: number;
}

const BubbleLamp: React.FC = () => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  useEffect(() => {
    const createBubble = () => {
      const newBubble: Bubble = {
        id: Date.now(),
        size: Math.random() * 20 + 10, // 10-30px
        left: Math.random() * 80 + 10, // Keep bubbles within frame
        animationDuration: Math.random() * 1 + 0.5, // 0.5-1.5s
      };
      setBubbles((prevBubbles) => [...prevBubbles, newBubble]);

      // Remove bubble after animation
      setTimeout(() => {
        setBubbles((prevBubbles) =>
          prevBubbles.filter((bubble) => bubble.id !== newBubble.id)
        );
      }, 2000);
    };

    // Create bubbles more frequently
    const interval = setInterval(createBubble, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-lg">
      <div className="relative w-48 h-64 bg-white border-8 border-gray-300 rounded-lg overflow-hidden">
        {/* Bubble Container */}
        <div className="absolute inset-4 bg-blue-50 rounded-md overflow-hidden">
          {/* Bubbles */}
          {bubbles.map((bubble) => (
            <div
              key={bubble.id}
              className="absolute bg-white/70 border border-blue-200 rounded-full"
              style={{
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                left: `${bubble.left}%`,
                bottom: "0",
                animation: `bubble-rise ${bubble.animationDuration}s ease-out`,
                animationFillMode: "forwards",
              }}
            />
          ))}
        </div>

        {/* Lamp Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 bg-gray-300 rounded-b-lg z-20"></div>
      </div>

      <style>{`
        @keyframes bubble-rise {
          0% {
            transform: translateY(0) scale(0.5);
            opacity: 1;
          }
          70% {
            transform: translateY(-400%) scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: translateY(-500%) scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BubbleLamp;
