"use client";

export default function ModeToggle({ mode, onToggle }) {
  return (
    <div className="flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
      <button
        onClick={() => onToggle("ai")}
        className={`px-3 py-1 rounded-md ${
          mode === "ai" ? "bg-blue-600 text-white" : "bg-gray-600 text-gray-300"
        } hover:bg-blue-500`}
      >
        AI
      </button>
      <button
        onClick={() => onToggle("human")}
        className={`px-3 py-1 rounded-md ${
          mode === "human"
            ? "bg-green-600 text-white"
            : "bg-gray-600 text-gray-300"
        } hover:bg-green-500`}
      >
        Human
      </button>
    </div>
  );
}
