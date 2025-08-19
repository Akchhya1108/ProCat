import { motion } from "framer-motion";
import catImg from "/cat.png";

export const moods = {
  idle: { rotate: [0, 2, -2, 0] },
  focus: { scale: [1, 1.1, 1], y: [0, -5, 0] },
  happy: { rotate: [0, 10, -10, 0] },
};

export default function Cat({ mood = "idle" }) {
  const messages = {
    idle: "Just chilling~",
    focus: "Focus mode! 🐾",
    happy: "Yay! Break time 🎉",
  };

  return (
    <div className="flex flex-col items-center p-4">
      <motion.img
        src={catImg}
        alt="cat"
        className="w-24 mb-2"
        animate={moods[mood]}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <p className="text-sm font-medium">{messages[mood]}</p>
    </div>
  );
}
