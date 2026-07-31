import React, { useState, useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "./Column";
import TaskModal from "../Task/TaskModal";
import { useBoard } from "../../context/BoardContext";
import confetti from "canvas-confetti";

const COLUMNS = ["backlog", "inprogress", "review", "done"];

const KanbanBoard = ({ onSelectTask }) => {
  const { tasks, updateTask, addTask } = useBoard();
  const [modalOpen, setModalOpen] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState("backlog");

  const [columns, setColumns] = useState(() => {
      const saved = localStorage.getItem("columns");
      return saved ? JSON.parse(saved) : COLUMNS;
});
  const [showinput, setShowinput] = useState(false);
  const [columnName, setColumnName] = useState("");

  useEffect(() => {
    const handler = (e) => {
      if (e.key.toLowerCase() === "n" && !e.target.matches("input, textarea")) {
        setDefaultStatus("backlog");
        setModalOpen(true);
      }
    };

    window.addEventListener("keydown", handler);

    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, []);

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const onDragEnd = async (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (destination.droppableId === "done") {
      confetti({ particleCount: 100, spread: 70 });
    }

    const colTasks = getTasksByStatus(destination.droppableId);
    const reordered = Array.from(colTasks);

    const [moved] = reordered.splice(source.index, 1);
    reordered.splice(destination.index, 0, moved);

    await Promise.all(
      reordered.map((task, index) =>
        updateTask(task._id, {
          status: destination.droppableId,
          order: index,
        }),
      ),
    );
  };

  const handleAddTask = (columnId) => {
    setDefaultStatus(columnId);
    setModalOpen(true);
  };

  const handleSubmit = () => {

    if (!columnName.trim()) {
      console.log("Empty column name!");
      return;
    }

    setColumns((prev) => {
      const updated = [...prev, columnName];
      return updated;
    });

    setColumnName("");
    setShowinput(false);
  };

  const handleCancel = () => {
    setShowinput(false);
    setColumnName("");
  };

  useEffect(() => {
  localStorage.setItem("columns", JSON.stringify(columns));
   }, [columns]);

  return (
    <>
      {showinput && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col bg-white rounded-lg p-6 w-96 shadow-xl">
            <input
              type="text"
              placeholder="Enter column name"
              value={columnName}
              onChange={(e) => setColumnName(e.target.value)}
              className="border rounded px-2 py-1 placeholder-gray-300 text-gray-950"
            />
            <div className="flex justify-between">
              <button onClick={handleCancel} className="p-4 text-red-600">
                Cancel
              </button>
              <button onClick={handleSubmit} className="p-4 text-green-600">
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4 p-4 overflow-x-hidden md:overflow-x-auto overflow-y-auto h-full">
          {columns.map((col) => (
            <Column
              key={col}
              columnId={col}
              tasks={getTasksByStatus(col)}
              onSelectTask={onSelectTask}
              onAddTask={handleAddTask}
            />
          ))}
          <button
            className="flex"
            onClick={() => {
              setShowinput(true);
            }}
          >
            + Add Column
          </button>
        </div>
      </DragDropContext>

      {modalOpen && (
        <TaskModal
          mode="create"
          defaultStatus={defaultStatus}
          onClose={() => setModalOpen(false)}
          onSave={async (data) => {
            await addTask(data);
            setModalOpen(false);
          }}
        />
      )}
    </>
  );
};

export default KanbanBoard;
