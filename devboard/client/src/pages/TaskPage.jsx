import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBoard } from "../context/BoardContext";
import TaskModal from "../components/Task/TaskModal";

const TaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allTasks, loading, updateTask } = useBoard();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)] text-[#888]">
        Loading task...
      </div>
    );
  }

  const task = allTasks.find((t) => t._id === id);

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[var(--bg-primary)] text-center p-8">
        <span className="text-6xl mb-4">🔍</span>
        <h2 className="text-2xl font-semibold text-[#f0f0f0] mb-2">
          Task not found
        </h2>
        <p className="text-[#888] mb-6">
          It may have been deleted, or you don't have access.
        </p>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <TaskModal
      mode="edit"
      task={task}
      onClose={() => navigate("/")}
      onSave={async (data) => {
        await updateTask(task._id, data);
        navigate("/");
      }}
      updateTask={updateTask}
    />
  );
};

export default TaskPage;
