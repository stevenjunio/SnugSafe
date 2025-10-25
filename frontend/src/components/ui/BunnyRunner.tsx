import React from 'react';
import './BunnyRunner.css';

interface BunnyRunnerProps {
  fileName?: string;
}

export const BunnyRunner: React.FC<BunnyRunnerProps> = ({ fileName }) => {
  return (
    <div className="bunny-runner-container">
      <div className="race-track">
        {/* Start flag */}
        <div className="flag start-flag">
          <div className="flag-pole"></div>
          <div className="flag-banner start"></div>
        </div>

        {/* Running bunny */}
        <div className="bunny-wrapper">
          <svg
            className="bunny"
            width="60"
            height="60"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left ear */}
            <ellipse
              cx="35"
              cy="25"
              rx="8"
              ry="20"
              fill="#FFB6D9"
              className="ear left-ear"
            />
            {/* Right ear */}
            <ellipse
              cx="65"
              cy="25"
              rx="8"
              ry="20"
              fill="#FFB6D9"
              className="ear right-ear"
            />
            {/* Inner left ear */}
            <ellipse cx="35" cy="28" rx="4" ry="12" fill="#FFC9E3" />
            {/* Inner right ear */}
            <ellipse cx="65" cy="28" rx="4" ry="12" fill="#FFC9E3" />
            {/* Head */}
            <circle cx="50" cy="45" r="25" fill="#FFB6D9" />
            {/* Left eye */}
            <circle cx="42" cy="42" r="3" fill="#333" className="eye" />
            {/* Right eye */}
            <circle cx="58" cy="42" r="3" fill="#333" className="eye" />
            {/* Nose */}
            <ellipse cx="50" cy="50" rx="4" ry="3" fill="#FF8FB5" />
            {/* Mouth */}
            <path
              d="M 45 52 Q 50 55 55 52"
              stroke="#FF8FB5"
              strokeWidth="1.5"
              fill="none"
              strokeLinecap="round"
            />
            {/* Body */}
            <ellipse cx="50" cy="75" rx="20" ry="18" fill="#FFB6D9" />
            {/* Tail */}
            <circle cx="70" cy="78" r="8" fill="#FFC9E3" className="tail" />
            {/* Front leg */}
            <ellipse
              cx="42"
              cy="88"
              rx="5"
              ry="10"
              fill="#FFB6D9"
              className="leg front-leg"
            />
            {/* Back leg */}
            <ellipse
              cx="58"
              cy="88"
              rx="5"
              ry="10"
              fill="#FFB6D9"
              className="leg back-leg"
            />
          </svg>
        </div>

        {/* Finish flag */}
        <div className="flag finish-flag">
          <div className="flag-pole"></div>
          <div className="flag-banner finish">
            <div className="checkered-pattern"></div>
          </div>
        </div>
      </div>

      {fileName && (
        <div className="upload-message">
          <span className="uploading-text">Uploading</span>
          <span className="dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
          <span className="file-name">{fileName}</span>
        </div>
      )}
    </div>
  );
};
