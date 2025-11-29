import React, {createContext, useContext, useState, useEffect} from "react";
import confetti from "canvas-confetti";

const GamificationContext = createContext();

export const useGamification = () => useContext(GamificationContext);

export const GamificationProvider = ({children}) => {
  // Initialize state from localStorage or defaults
  const [xp, setXp] = useState(() => parseInt(localStorage.getItem("user_xp")) || 0);
  const [streak, setStreak] = useState(() => parseInt(localStorage.getItem("user_streak")) || 1);
  const [level, setLevel] = useState(() => parseInt(localStorage.getItem("user_level")) || 1);

  // Persist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("user_xp", xp);
    localStorage.setItem("user_streak", streak);
    localStorage.setItem("user_level", level);
  }, [xp, streak, level]);

  const addXp = (amount) => {
    setXp((prev) => {
      const newXp = prev + amount;
      // Simple level up logic: Level up every 100 XP
      const newLevel = Math.floor(newXp / 100) + 1;
      if (newLevel > level) {
        setLevel(newLevel);
        triggerLevelUpConfetti();
      }
      return newXp;
    });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: {y: 0.6},
      colors: ["#58CC02", "#1CB0F6", "#FFC800"], // Our brand colors
    });
  };

  const triggerLevelUpConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 0};

    const random = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: {x: random(0.1, 0.3), y: Math.random() - 0.2},
      });
      confetti({
        ...defaults,
        particleCount,
        origin: {x: random(0.7, 0.9), y: Math.random() - 0.2},
      });
    }, 250);
  };

  return (
    <GamificationContext.Provider
      value={{
        xp,
        streak,
        level,
        addXp,
        triggerConfetti,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};
