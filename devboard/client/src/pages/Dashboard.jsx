import React, { useState, useEffect } from "react";
import KanbanBoard from "../components/Board/KanbanBoard";
import PomodoroTimer from "../components/Pomodoro/PomodoroTimer";
import TaskModal from "../components/Task/TaskModal";
import Heatmap from "../components/Heatmap/Heatmap";
import { useBoard } from "../context/BoardContext";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="text-[#a0a0a5] text-sm font-medium animate-pulse">Loading workspace...</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { user, logout, updateTask, loading, searchQuery, setSearchQuery, tasks, addTask, activeTag, setActiveTag } = useBoard();
  useEffect(() => {
    document.title = "Dashboard — DevBoard";
  }, []);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isCreatingFirstTask, setIsCreatingFirstTask] = useState(false);
  const [filter, setfilter] = useState('all');
  if (loading) {
    return <LoadingSpinner />;
  }

  const handleSessionComplete = async () => {
    if (selectedTask) {
      await updateTask(selectedTask._id, { pomodoroCount: (selectedTask.pomodoroCount || 0) + 1 });
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[var(--bg-primary)]">
      {/* Top Navbar */}
      <div className="flex flex-col gap-3 px-5 py-3 bg-[var(--bg-card)] border-b border-[var(--border-primary)] md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg">🗂️</span>
          <span className="font-semibold text-[#f0f0f0]">DevBoard</span>
          <span className="text-xs bg-purple-600/20 text-purple-400 px-2 py-0.5 rounded-full ml-1">
            beta
          </span>
          <span className="text-xs text-[#666] ml-2">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
          {activeTag && (
            <button
              onClick={() => setActiveTag(null)}
              className="text-xs bg-purple-600/30 text-purple-300 px-2 py-0.5 rounded-full flex items-center gap-1 hover:bg-purple-600/40 transition"
            >
              #{activeTag} <span aria-hidden>✕</span>
            </button>
          )}
        </div>
        <div className="flex-1 w-full max-w-xl md:px-6">
          <label className="relative block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks by title or tag..."
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-xl px-4 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 transition"
            />
          </label>
        </div>
        <div className="flex items-center gap-3">
          <select
          onChange={(e) => setfilter(e.target.value)}
          className="bg-[#2a2a2f] text-[#888] text-xs
          rounded-lg px-2 py-1.5 border border-[#333]"
          >
            <option value="all">All Priority</option>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
          </select>

        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#666]">👋 {user?.name}</span>
          <button
            onClick={logout}
            className="text-xs text-[#666] hover:text-[#aaa] transition px-3 py-1.5 border border-[var(--border-primary)] rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Activity Heatmap */}
      <Heatmap />

      {/* Pomodoro Bar */}
      <PomodoroTimer
        activeTaskTitle={selectedTask?.title}
        onSessionComplete={handleSessionComplete}
      />
      {/* Kanban Board */}
      <div className="flex-1 overflow-hidden">
        {tasks.length === 0 ? (
          <div className="flex-1 h-full flex flex-col items-center justify-center text-center p-8">
            <span className="text-6xl mb-4">👋</span>
            <h2 className="text-2xl font-semibold text-[#f0f0f0] mb-2">Welcome to your board!</h2>
            <p className="text-[#a0a0a5] mb-6 max-w-md">
              You don't have any tasks yet. Click + Add card to create your first one.
            </p>
            <button
              onClick={() => setIsCreatingFirstTask(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
            >
              + Add your first card
            </button>
          </div>
        ) : (
          <KanbanBoard onSelectTask={setSelectedTask} priorityFilter={filter} />
        )}
      </div>
      {/* Task Edit Modal */}
      {selectedTask && (
        <TaskModal
          mode="edit"
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onSave={async (data) => {
            await updateTask(selectedTask._id, data);
            setSelectedTask(null);
          }}
          updateTask={updateTask}
        />
      )}
      {/* Create First Task Modal */}
      {isCreatingFirstTask && (
        <TaskModal
          mode="create"
          defaultStatus="backlog"
          onClose={() => setIsCreatingFirstTask(false)}
          onSave={async (data) => {
            await addTask(data);
            setIsCreatingFirstTask(false);
          }}
        />
      )}
    </div>
  );
};
export default Dashboard;
