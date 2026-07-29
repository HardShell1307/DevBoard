import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";

const BoardContext = createContext();

export const BoardProvider = ({ children }) => {
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("devboard_user");
    return saved ? JSON.parse(saved) : null;
  });

  const authHeaders = () => ({
    headers: { Authorization: `Bearer ${user?.token}` },
  });

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await axios.get("/api/tasks", authHeaders());
      setAllTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const addTask = async (taskData) => {
    const { data } = await axios.post("/api/tasks", taskData, authHeaders());
    setAllTasks((prev) => [...prev, data]);
  };

  const updateTask = async (id, updates) => {
    const { data } = await axios.put(`/api/tasks/${id}`, updates, authHeaders());
    setAllTasks((prev) => prev.map((t) => (t._id === id ? data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`/api/tasks/${id}`, authHeaders());
    setAllTasks((prev) => prev.filter((t) => t._id !== id));
  };

  const addSnippet = async (taskId, snippet) => {
    const { data } = await axios.post(`/api/tasks/${taskId}/snippets`, snippet, authHeaders());
    setAllTasks((prev) => prev.map((t) => (t._id === taskId ? data : t)));
  };

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("devboard_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("devboard_user");
    setAllTasks([]);
    setSearchQuery("");
  };

  const tasks = useMemo(() => {
    let filtered = allTasks;

    // Filter by active tag if one is selected
    if (activeTag) {
      filtered = filtered.filter((task) =>
        task.tags?.includes(activeTag)
      );
    }

    const query = searchQuery.trim().toLowerCase();

    if (!query) return filtered;

    const priorityLabel = (priority) => {
      if (!priority) return "";
      return `${priority} priority`;
    };

    return filtered.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description = task.description?.toLowerCase() || "";
      const tags = task.tags?.join(" ").toLowerCase() || "";
      const priority = task.priority?.toLowerCase() || "";
      const priorityText = priorityLabel(task.priority).toLowerCase();

      return (
        title.includes(query) ||
        description.includes(query) ||
        tags.includes(query) ||
        priority.includes(query) ||
        priorityText.includes(query)
      );
    });
  }, [allTasks, searchQuery, activeTag]);

  return (
    <BoardContext.Provider
      value={{
        tasks,
        loading,
        user,
        searchQuery,
        setSearchQuery,
        activeTag,
        setActiveTag,
        addTask,
        updateTask,
        deleteTask,
        addSnippet,
        login,
        logout,
        fetchTasks,
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => useContext(BoardContext);
