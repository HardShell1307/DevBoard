import React from "react";
import { Droppable } from "@hello-pangea/dnd";
import TaskCard from "./TaskCard";

const COLUMN_CONFIG = {
  backlog:    { label: "Backlog",      color: "#888",     dot: "bg-gray-500" },
  inprogress: { label: "In Progress",  color: "#7F77DD",  dot: "bg-purple-500" },
  review:     { label: "Review",       color: "#EF9F27",  dot: "bg-yellow-500" },
  done:       { label: "Done",         color: "#639922",  dot: "bg-green-500" },
};

const Column = ({ columnId, tasks, onSelectTask, onAddTask }) => {
  const config = COLUMN_CONFIG[columnId];

  return (
    <div className="flex flex-col w-56 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${config.dot}`} />
          <span className="text-xs font-semibold uppercase tracking-wider text-[#888]">
            {config.label}
          </span>
          <span className="text-[10px] bg-[var(--border-primary)] text-[#666] px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>
      </div>

      {/* Droppable cards area */}
      <Droppable droppableId={columnId}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 flex-1 min-h-[80px] rounded-lg p-1 transition-colors
              ${snapshot.isDraggingOver ? "bg-purple-500/5" : ""}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task._id}
                task={task}
                index={index}
                onSelect={onSelectTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add card button */}
      <button
        onClick={() => onAddTask(columnId)}
        className="mt-2 flex items-center gap-2 text-xs text-[#555] hover:text-[#888] px-2 py-1.5 rounded hover:bg-[var(--bg-card)] transition"
      >
        <span>＋</span> Add card
      </button>
    </div>
  );
};

export default Column;
