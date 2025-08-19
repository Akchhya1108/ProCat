import { useState } from "react";
import Cat from "./Cat";

export default function Popup() {
  const [mood, setMood] = useState("idle");

  return (
    <div className="fixed bottom-4 right-4 bg-white shadow-lg rounded-xl p-4">
      <Cat mood={mood} />
      <div className="flex gap-2 mt-3">
        <button onClick={() => setMood("idle")}>Idle</button>
        <button onClick={() => setMood("focus")}>Focus</button>
        <button onClick={() => setMood("happy")}>Happy</button>
      </div>
    </div>
  );
}
