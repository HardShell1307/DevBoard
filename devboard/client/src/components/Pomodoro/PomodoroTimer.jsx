import React from "react";
import { usePomodoro } from "../../hooks/usePomodoro";

const PomodoroTimer = ({ activeTaskTitle, onSessionComplete }) => {
  const { timeLeft, isRunning, isBreak, sessionCount, toggle, reset, format, progress } =
    usePomodoro(onSessionComplete);

  return (
    <div className="flex items-center gap-3 bg-[var(--bg-card)] px-4 py-2 border-b border-[var(--border-primary)] text-sm">
      <span className="text-lg">🍅</span>
      <span className="text-[#888] text-xs truncate max-w-[160px]">
        {activeTaskTitle || "No task selected"}
      </span>
      <span
        className={`font-mono font-bold text-base ${
          isBreak ? "text-green-400" : "text-purple-400"
        }`}
      >
        {format(timeLeft)}
      </span>
      <div className="flex-1 h-1.5 bg-[var(--border-primary)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isBreak ? "bg-green-500" : "bg-purple-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[#555] text-xs whitespace-nowrap">
        {isBreak ? "Break" : `Session ${sessionCount + 1}`}
      </span>
      <button
        onClick={toggle}
        className="px-3 py-1 rounded bg-[var(--border-primary)] hover:bg-[#333] text-xs font-medium transition"
      >
        {isRunning ? "⏸ Pause" : "▶ Start"}
      </button>
      <button
        onClick={reset}
        className="px-3 py-1 rounded bg-[var(--border-primary)] hover:bg-[#333] text-xs font-medium transition text-[#888]"
      >
        ↺
      </button>
    </div>
  );
};

export default PomodoroTimer;
