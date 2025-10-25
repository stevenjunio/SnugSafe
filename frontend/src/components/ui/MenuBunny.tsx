import React, { useEffect, useState, useRef } from 'react';
import './MenuBunny.css';

interface MenuBunnyProps {
  activeIndex: number;
}

export const MenuBunny: React.FC<MenuBunnyProps> = ({ activeIndex }) => {
  const [position, setPosition] = useState(activeIndex);
  const [isRunning, setIsRunning] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // On first mount, just set position without running animation
    if (isFirstMount.current) {
      setPosition(activeIndex);
      isFirstMount.current = false;
      return;
    }

    // When activeIndex changes, bunny runs to new position
    setIsRunning(true);
    setPosition(activeIndex);

    // After transition completes, bunny returns to sitting state
    const timer = setTimeout(() => {
      setIsRunning(false);
    }, 650); // Slightly longer than transition time

    return () => clearTimeout(timer);
  }, [activeIndex]);

  return (
    <div className="menu-bunny-container">
      <div
        className={`menu-bunny ${isRunning ? 'running' : 'sitting'}`}
        style={{
          transform: `translateY(${position * 48}px)`,
        }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Left ear */}
          <ellipse
            cx="35"
            cy="25"
            rx="8"
            ry="20"
            fill="#C586A1"
            className="menu-ear left-ear"
          />
          {/* Right ear */}
          <ellipse
            cx="65"
            cy="25"
            rx="8"
            ry="20"
            fill="#C586A1"
            className="menu-ear right-ear"
          />
          {/* Inner left ear */}
          <ellipse cx="35" cy="28" rx="4" ry="12" fill="#D8A4BC" />
          {/* Inner right ear */}
          <ellipse cx="65" cy="28" rx="4" ry="12" fill="#D8A4BC" />
          {/* Head */}
          <circle cx="50" cy="45" r="25" fill="#C586A1" />
          {/* Left eye */}
          <circle cx="42" cy="42" r="3" fill="#333" className="menu-eye" />
          {/* Right eye */}
          <circle cx="58" cy="42" r="3" fill="#333" className="menu-eye" />
          {/* Nose */}
          <ellipse cx="50" cy="50" rx="4" ry="3" fill="#A86F8A" />
          {/* Mouth - happy when sitting, determined when running */}
          <path
            d={isRunning ? "M 45 52 Q 50 54 55 52" : "M 45 52 Q 50 56 55 52"}
            stroke="#A86F8A"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            className="mouth"
          />
          {/* Body */}
          <ellipse cx="50" cy="75" rx="20" ry="18" fill="#C586A1" />
          {/* Tail */}
          <circle cx="70" cy="78" r="8" fill="#D8A4BC" className="menu-tail" />
          {/* Front paw */}
          <ellipse
            cx="42"
            cy="88"
            rx="5"
            ry="10"
            fill="#C586A1"
            className="menu-leg front-leg"
          />
          {/* Back paw */}
          <ellipse
            cx="58"
            cy="88"
            rx="5"
            ry="10"
            fill="#C586A1"
            className="menu-leg back-leg"
          />
        </svg>

        {/* Little hearts when sitting */}
        {!isRunning && (
          <div className="bunny-hearts">
            <span className="heart">❤️</span>
          </div>
        )}

        {/* Speed lines when running */}
        {isRunning && (
          <div className="speed-lines">
            <span className="speed-line"></span>
            <span className="speed-line"></span>
            <span className="speed-line"></span>
          </div>
        )}
      </div>
    </div>
  );
};
