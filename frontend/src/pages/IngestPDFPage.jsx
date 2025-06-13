import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const IngestPDFPage = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setMessage("⚠️ Please select a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setMessage("");
      const res = await axios.post("http://127.0.0.1:8000/ingestfile", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      const collectionName = res.data.collection_name;
      setMessage(res.data.message || "✅ Ingestion successful!");

      // Navigate after short delay (for user to see success msg)
      setTimeout(() => {
        navigate(`/query?collection=${encodeURIComponent(collectionName)}`);
      }, 1000);

    } catch (err) {
      setMessage(err.response?.data?.detail || "❌ Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#111] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
        Ingest PDF
      </h2>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500 rounded-xl p-6 w-full max-w-md cursor-pointer hover:bg-purple-500/10 transition">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="hidden"
        />
        <p className="text-sm text-gray-400">
          {file ? file.name : "Click to select your PDF file"}
        </p>
      </label>

      <button
        onClick={handleUpload}
        disabled={loading}
        className={`mt-6 bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-white font-semibold py-2.5 px-6 rounded-2xl shadow-lg transform hover:scale-105 active:scale-95 transition-all duration-300 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {loading ? "Uploading..." : "Upload"}
      </button>

      {message && (
        <p className={`mt-4 text-center ${message.includes("✅") ? "text-green-400" : message.includes("❌") ? "text-red-400" : "text-yellow-400"}`}>
          {message}
        </p>
      )}
    </div>
  );
};

export default IngestPDFPage;
