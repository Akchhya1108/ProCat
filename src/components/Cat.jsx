import { motion } from "framer-motion";
import catImg from "/cat.png";

export const moods = {
  idle: { 
    rotate: [0, 2, -2, 0],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
  },
  focus: { 
    scale: [1, 1.05, 1], 
    y: [0, -3, 0],
    transition: { duration: 1, repeat: Infinity, ease: "easeInOut" }
  },
  happy: { 
    rotate: [0, 15, -15, 0],
    scale: [1, 1.1, 1],
    transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
  },
  break: {
    y: [0, -8, 0],
    rotate: [0, 5, -5, 0],
    transition: { duration: 1.2, repeat: Infinity, ease: "bounceInOut" }
  }
};

export default function Cat({ mood = "idle" }) {
  const messages = {
    idle: "Ready when you are! 😸",
    focus: "You've got this! 🎯",
    happy: "Great work! 🎉",
    break: "Rest time! 🌱"
  };

  const colors = {
    idle: "text-gray-600",
    focus: "text-blue-600", 
    happy: "text-green-600",
    break: "text-purple-600"
  };

  return (
    <div className="flex flex-col items-center p-4">
      <motion.img
        src={catImg}
        alt="Productivity Cat"
        className="w-24 mb-3 filter drop-shadow-sm"
        animate={moods[mood]}
        key={mood} // Force re-render when mood changes
      />
      <p className={`text-sm font-medium ${colors[mood]} transition-colors duration-300`}>
        {messages[mood]}
      </p>
      
      {/* Mood indicator dots */}
      <div className="flex gap-1 mt-2">
        {Object.keys(moods).map((m) => (
          <div
            key={m}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              mood === m 
                ? `${colors[m].replace('text-', 'bg-')} opacity-100` 
                : 'bg-gray-300 opacity-50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}