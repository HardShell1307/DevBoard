import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBoard } from "../context/BoardContext";

const Login = () => {
  
  const { login } = useBoard();
  useEffect(() => {
  document.title = "Login — DevBoard";
}, []);
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const payload = isRegister ? form : { email: form.email, password: form.password };
      const { data } = await axios.post(endpoint, payload);
      login(data);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">🗂️</div>
          <h1 className="text-2xl font-bold text-[#f0f0f0]">DevBoard</h1>
          <p className="text-[#666] text-sm mt-1">Kanban built for developers</p>
        </div>

        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl p-6 flex flex-col gap-3">
          {isRegister && (
            <input
              type="text"
              placeholder="Your name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-purple-500"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-purple-500"
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              onKeyDown={(e) =>
                e.key === "Enter" && handleSubmit()
              }
              className="w-full bg-[var(--bg-primary)] border border-[var(--border-primary)] rounded-lg px-3 py-2.5 pr-10 text-sm text-[#f0f0f0] placeholder-[#555] focus:outline-none focus:border-purple-500"
            />
            <button
              type="button"
              onClick={() => setShow((prev) => !prev)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#777] hover:text-[#ccc]"
            >
              👁️
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition disabled:opacity-40"
          >
            {loading ? "Please wait..." : isRegister ? "Create Account" : "Sign In"}
          </button>

          <button
            onClick={() => { setIsRegister((v) => !v); setError(""); }}
            className="text-xs text-[#666] hover:text-[#aaa] transition text-center"
          >
            {isRegister ? "Already have an account? Sign in" : "No account? Register"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
