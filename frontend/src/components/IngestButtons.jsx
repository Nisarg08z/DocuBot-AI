// src/components/IngestButtons.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const IngestButtons = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap justify-center gap-6">
      <button
        onClick={() => navigate("/ingest-pdf")}
        className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800
                   hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
                   text-white font-semibold py-3 px-6 rounded-2xl shadow-lg
                   transform hover:scale-105 active:scale-95 transition-all duration-300
                   ring-1 ring-purple-500/50 hover:ring-purple-400/80"
      >
        Ingest PDF
      </button>
      <button
        onClick={() => navigate("/ingest-web")}
        className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800
                   hover:from-purple-700 hover:via-purple-800 hover:to-purple-900
                   text-white font-semibold py-3 px-6 rounded-2xl shadow-lg
                   transform hover:scale-105 active:scale-95 transition-all duration-300
                   ring-1 ring-purple-500/50 hover:ring-purple-400/80"
      >
        Ingest Web
      </button>
    </div>
  );
};

export default IngestButtons;
