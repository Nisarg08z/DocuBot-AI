import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const QueryPage = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [searchParams] = useSearchParams();
  const collection = searchParams.get("collection");
  const messagesEndRef = useRef(null);

  const handleQuery = async () => {
    if (!query.trim()) return;

    const userMessage = { text: query, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      const res = await axios.post("http://127.0.0.1:8000/query", {
        query,
        collection_name: collection,
      });

      const botMessage = {
        text: res.data.response || "No response.",
        sender: "bot",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      const botMessage = {
        text: err.response?.data?.detail || "Query failed.",
        sender: "bot",
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#0d0d0d] via-[#1a1a1a] to-[#111] text-white overflow-hidden font-sans">
      
      {/* Animated Header */}
      <div className="text-center py-4 sticky top-0 z-10 bg-transparent backdrop-blur-md">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-fuchsia-500 via-purple-400 to-indigo-500 bg-clip-text text-transparent animate-pulse tracking-wide">
          Talk with Your AI Assistant
        </h2>
      </div>

      {/* Chat Area */}
      <div className="flex-grow overflow-y-auto px-4 py-6 space-y-6 scrollbar-none">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] px-5 py-3 rounded-2xl shadow-xl backdrop-blur-md ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-purple-600 to-fuchsia-600 text-white rounded-br-none"
                  : "bg-gradient-to-br from-slate-800 to-gray-900 text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}

        {/* Typing Animation */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800 text-white px-4 py-3 rounded-2xl shadow-md max-w-[60%] flex space-x-2 items-center">
              <span className="animate-bounce">●</span>
              <span className="animate-bounce delay-150">●</span>
              <span className="animate-bounce delay-300">●</span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Input Area (No Top Border) */}
      <div className="sticky bottom-0 w-full bg-[#1a1a1a]/90 backdrop-blur-md px-4 py-3 z-10">
        <div className="flex items-center max-w-4xl mx-auto space-x-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            placeholder="Ask something..."
            className="flex-grow p-3 rounded-full bg-[#2d2d2d] border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-600 text-white transition-all"
          />
          <button
            onClick={handleQuery}
            className="px-5 py-3 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700 hover:brightness-110 transition-all shadow-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default QueryPage;
