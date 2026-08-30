import React, { useMemo, useState } from "react";
import { useBoard } from "../../context/BoardContext";

const WEEKS_TO_SHOW = 12;

const formatDateKey = (date) => date.toISOString().split("T")[0];

const getColorClass = (count) => {
  if (count === 0) return "bg-[var(--bg-card)]";
  if (count === 1) return "bg-purple-900";
  if (count <= 3) return "bg-purple-700";
  if (count <= 5) return "bg-purple-500";
  return "bg-purple-400";
};

const Heatmap = () => {
  const { tasks } = useBoard();
  const [hovered, setHovered] = useState(null);

  // count "done" tasks per day, keyed by YYYY-MM-DD
  const countsByDate = useMemo(() => {
    const map = {};
    tasks
      .filter((t) => t.status === "done" && t.createdAt)
      .forEach((t) => {
        const key = formatDateKey(new Date(t.createdAt));
        map[key] = (map[key] || 0) + 1;
      });
    return map;
  }, [tasks]);

  // build a 12 (weeks) x 7 (days) grid ending on the current week
  const weeks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (6 - today.getDay())); // upcoming Saturday

    const start = new Date(endOfWeek);
    start.setDate(endOfWeek.getDate() - WEEKS_TO_SHOW * 7 + 1); // Sunday, 12 weeks back

    const cols = [];
    for (let w = 0; w < WEEKS_TO_SHOW; w++) {
      const col = [];
      for (let d = 0; d < 7; d++) {
        const day = new Date(start);
        day.setDate(start.getDate() + w * 7 + d);
        col.push(day);
      }
      cols.push(col);
    }
    return cols;
  }, []);

  const formatTooltip = (date, count) => {
    const label = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    return `${count} task${count === 1 ? "" : "s"} completed on ${label}`;
  };

  return (
    <div className="px-5 py-4 bg-[var(--bg-card)] border-b border-[var(--border-primary)]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-[var(--text-muted)]">Task Activity</span>
        {hovered && <span className="text-xs text-[var(--text-primary)]">{hovered}</span>}
      </div>
      <div className="flex gap-[3px]">
        {weeks.map((col, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-[3px]">
            {col.map((day, dIdx) => {
              const isFuture = day > new Date();
              const key = formatDateKey(day);
              const count = countsByDate[key] || 0;

              return (
                <div
                  key={dIdx}
                  onMouseEnter={() => !isFuture && setHovered(formatTooltip(day, count))}
                  onMouseLeave={() => setHovered(null)}
                  title={isFuture ? undefined : formatTooltip(day, count)}
                  className={`w-3 h-3 rounded-sm transition ${
                    isFuture ? "bg-transparent" : getColorClass(count)
                  }`}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
