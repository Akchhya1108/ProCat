import { useState } from "react";
import Cat from "./components/Cat.jsx";
import Timer from "./components/Timer.jsx";

export default function App() {
  const [mode, setMode] = useState("idle");

  return (
    <div className="p-4 w-64">
      <h1 className="text-lg font-bold mb-2">🐱 Productivity Cat</h1>
      <Cat mood={mode} />
      <Timer onStart={() => setMode("focus")} onBreak={() => setMode("happy")} />
    </div>
  );
}
