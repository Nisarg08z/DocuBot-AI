import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IngestWebPage = () => {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleIngest = async () => {
    if (!url.trim()) {
      setMessage("⚠️ Please enter a URL.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post("http://127.0.0.1:8000/ingestweb", { url });

      const collectionName = res.data.collection_name;
      setMessage(res.data.message || "✅ Ingestion successful!");

      setTimeout(() => {
        navigate(`/query?collection=${encodeURIComponent(collectionName)}`);
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.detail || "❌ Ingestion failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#111] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Ingest Web URL
      </h2>

      <input
        type="text"
        placeholder="Enter URL (https://example.com)"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="mb-4 p-3 rounded-xl bg-[#1a1a1a] text-white border border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-600 w-full max-w-md transition"
      />

      <button
        onClick={handleIngest}
        disabled={loading}
        className={`bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Processing..." : "Ingest"}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes("✅") ? "text-green-400" : message.includes("❌") ? "text-red-400" : "text-yellow-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default IngestWebPage;
