import catImg from "/cat.png";

export default function Cat({ mood }) {
  let text = "Just chilling~";
  if (mood === "focus") text = "Focus mode! 🐾";
  if (mood === "happy") text = "Yay! Break time 🎉";

  return (
    <div className="flex flex-col items-center">
      <img src={catImg} alt="cat" className="w-24 mb-2" />
      <p className="text-sm">{text}</p>
    </div>
  );
}
