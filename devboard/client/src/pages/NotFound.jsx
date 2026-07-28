import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--bg-primary)] text-center p-8">
      <span className="text-6xl mb-4">🗂️</span>
      <h2 className="text-3xl font-bold text-[#f0f0f0] mb-3">Lost in the backlog?</h2>
      <p className="text-[#a0a0a5] mb-6 max-w-md text-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg font-medium transition"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
