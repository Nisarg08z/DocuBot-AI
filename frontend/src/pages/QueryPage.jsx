import React, { useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

const QueryPage = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [searchParams] = useSearchParams();
  const collection = searchParams.get("collection");

  const handleQuery = async () => {
    if (!query) {
      setResponse("Please enter a query.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:8000/query", {
        query,
        collection_name: collection
      });
      setResponse(res.data.response || "No response.");
    } catch (err) {
      setResponse(err.response?.data?.detail || "Query failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col items-center justify-center p-4">
      <h2 className="text-2xl font-bold mb-4">Ask your AI Assistant</h2>
      <input
        type="text"
        placeholder="Enter your question..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mb-4 p-2 rounded bg-[#1a1a1a] text-white border border-gray-600 w-full max-w-md"
      />
      <button
        onClick={handleQuery}
        className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-lg"
      >
        Query
      </button>
      {response && (
        <div className="mt-4 p-4 bg-[#1a1a1a] rounded shadow w-full max-w-2xl">
          {response}
        </div>
      )}
    </div>
  );
};

export default QueryPage;
