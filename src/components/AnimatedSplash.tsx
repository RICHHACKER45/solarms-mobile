import React, { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import './AnimatedSplash.css';

interface AnimatedSplashProps {
  onAnimationComplete: () => void;
}

const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ onAnimationComplete }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Hide the native splash screen as soon as our React component mounts
    SplashScreen.hide().catch(console.error);

    // Let the animation play for 2.5 seconds, then trigger fade out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 2500);

    // After fade out completes (500ms), remove from DOM
    const completeTimer = setTimeout(() => {
      onAnimationComplete();
    }, 3000); 

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onAnimationComplete]);

  return (
    <div className={`splash-container ${isFadingOut ? 'splash-fade-out' : ''}`}>
      <svg 
        className="splash-logo" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path stroke="url(#gradient)" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        <circle stroke="url(#gradient)" cx="12" cy="12" r="4" />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4a62a" />
            <stop offset="100%" stopColor="#f39c12" />
          </linearGradient>
        </defs>
      </svg>
      <div className="splash-title">SOLARMS</div>
    </div>
  );
};

export default AnimatedSplash;
