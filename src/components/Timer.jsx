import { useEffect, useState } from "react";

export default function Timer({ onStart, onBreak }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      onBreak();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="mt-4">
      <p className="font-mono text-xl">{formatTime(timeLeft)}</p>
      <div className="mt-2 flex gap-2 justify-center">
        <button
          onClick={() => {
            setIsRunning(true);
            onStart();
          }}
          className="px-3 py-1 bg-pink-300 rounded-xl hover:bg-pink-400"
        >
          Start
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(25 * 60);
          }}
          className="px-3 py-1 bg-gray-300 rounded-xl hover:bg-gray-400"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
