import { useState } from "react";
import axios from "axios";

export default function App() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [collection, setCollection] = useState("");
  const [answer, setAnswer] = useState("");
  const [sources, setSources] = useState([]);

  const handleSubmitUrl = async () => {
    try {
      const res = await axios.post("http://localhost:8000/process_url", { url });
      setCollection(res.data.collection);
      alert("Website processed. Now you can ask questions!");
    } catch (e) {
      alert("Failed to process website.");
    }
  };

  const handleAsk = async () => {
    try {
      const res = await axios.post("http://localhost:8000/ask", { question, collection });
      setAnswer(res.data.answer);
      setSources(res.data.sources);
    } catch (e) {
      alert("Failed to get answer.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-white bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold mb-4">🌐 Website Docs Chat</h1>

      <input
        type="text"
        placeholder="Enter Website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="w-full p-2 rounded bg-gray-800"
      />
      <button
        onClick={handleSubmitUrl}
        className="mt-2 bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
      >
        Process Website
      </button>

      {collection && (
        <>
          <div className="mt-6">
            <input
              type="text"
              placeholder="Ask a question..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full p-2 rounded bg-gray-800"
            />
            <button
              onClick={handleAsk}
              className="mt-2 bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            >
              Ask
            </button>
          </div>

          {answer && (
            <>
              <div className="mt-6 bg-gray-800 p-4 rounded">
                <h2 className="text-xl font-semibold">Answer</h2>
                <p>{answer}</p>
              </div>

              <div className="mt-4">
                <h3 className="text-lg font-semibold">Sources</h3>
                {sources.map((src, idx) => (
                  <details key={idx} className="mt-2 bg-gray-800 p-2 rounded">
                    <summary>Chunk {src.chunk_id}</summary>
                    <p className="text-sm">{src.content}</p>
                  </details>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
