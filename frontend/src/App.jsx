import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import IngestPDFPage from "./pages/IngestPDFPage";
import IngestWebPage from "./pages/IngestWebPage";
import QueryPage from "./pages/QueryPage"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/ingest-pdf" element={<IngestPDFPage />} />
        <Route path="/ingest-web" element={<IngestWebPage />} />
        <Route path="/query" element={<QueryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
