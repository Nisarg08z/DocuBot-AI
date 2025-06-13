import React from "react";
import Lottie from "lottie-react";
import aiAnimation from "../assets/ai-animation.json";

const Animation = () => {
  return (
    <div className="w-80 h-80 mb-8 flex items-center justify-center">
      <Lottie animationData={aiAnimation} loop />
    </div>
  );
};

export default Animation;
