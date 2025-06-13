import React from "react";
import Header from "../components/Header";
import Animation from "../components/Animation";
import IngestButtons from "../components/IngestButtons";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0f0f0f] via-[#1a1a1a] to-[#111] text-white flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center">
        <Animation />
        <IngestButtons />
      </main>
    </div>
  );
};

export default LandingPage;
