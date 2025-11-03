import React from "react";
import { LuSparkles } from "react-icons/lu";
import { useAppStore } from "../../stores/appStore";

const AIBtn: React.FC = () => {
  const { toggleAIModal } = useAppStore();

  const handleClick = () => {
    toggleAIModal();
  };

  return (
    <div className="fixed bottom-6 right-6 z-20">
      <button
        onClick={handleClick}
        className="group relative cursor-pointer flex items-center justify-center w-16 h-16 bg-primary rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300 ease-in-out"
        aria-label="AI Assistant"
      >
        {/* Pulsing ring animation */}
        <span className="absolute inset-0 rounded-full bg-success-bg opacity-75 animate-ping"></span>

        {/* Icon */}
        <div className="relative z-10">
          <LuSparkles className="w-7 h-7 text-background-dark transition-transform duration-300 group-hover:rotate-12" />
        </div>
      </button>
    </div>
  );
};

export default AIBtn;
