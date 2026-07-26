import { useState, useEffect, useRef } from "react";

const WORK_DURATION = 25 * 60; // 25 minutes
const BREAK_DURATION = 5 * 60; // 5 minutes
const LONG_BREAK_DURATION = 15 * 60; // 15 minutes

export const usePomodoro = (onSessionComplete) => {
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(() =>
    Number(localStorage.getItem("pom_sessions") || 0),
  );
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            if (!isBreak) {
              const nextCount = sessionCount + 1;
              setSessionCount(nextCount);
              localStorage.setItem("pom_sessions", sessionCount + 1);
              if (onSessionComplete) onSessionComplete();
              setIsBreak(true);
              const isLongBreak = nextCount % 4 === 0 && nextCount > 0;
              return isLongBreak ? LONG_BREAK_DURATION : BREAK_DURATION;
            } else {
              setIsBreak(false);
              return WORK_DURATION;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak, sessionCount, onSessionComplete]);

  const toggle = () => setIsRunning((r) => !r);

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSessionCount(0);
    setTimeLeft(WORK_DURATION);
  };

  const format = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const currentBreakDuration =
    sessionCount % 4 === 0 && sessionCount > 0
      ? LONG_BREAK_DURATION
      : BREAK_DURATION;

  const progress = isBreak
    ? ((currentBreakDuration - timeLeft) / currentBreakDuration) * 100
    : ((WORK_DURATION - timeLeft) / WORK_DURATION) * 100;

  return {
    timeLeft,
    isRunning,
    isBreak,
    sessionCount,
    toggle,
    reset,
    format,
    progress,
  };
};
