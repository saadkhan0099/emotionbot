"use client";

import { useState, useRef, useEffect } from "react";
import ModeToggle from "./components/ModeToggle";

export default function Home() {
  const [mode, setMode] = useState("ai");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [humanResponse, setHumanResponse] = useState("");
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonResults, setComparisonResults] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [tone, setTone] = useState("Neutral");
  const [sessionHistory, setSessionHistory] = useState([]); // ✅ Added session history
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleToggleMode = (newMode) => {
    setMode(newMode);
    setShowComparison(false);
    setComparisonResults(null);
  };

  const toggleVoice = () => {
    setVoiceEnabled((prev) => !prev);
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const cleanText = text.replace(/[\u{1F600}-\u{1F6FF}]/gu, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.pitch = 1.3;
      utterance.rate = 1.05;
      utterance.volume = 1;
      utterance.voice =
        window.speechSynthesis
          .getVoices()
          .find((v) => v.name.includes("Google")) || null;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setCurrentQuestion(input);
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsLoading(true);
    setShowComparison(false);
    setComparisonResults(null);

    try {
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input, tone }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

      const data = await response.json();

      setTimeout(() => {
        setIsLoading(false);
        let index = 0;
        const typingMessage = { role: "assistant", content: "" };

        setMessages((prev) => [...prev, typingMessage]);

        const interval = setInterval(() => {
          if (index < data.reply.length) {
            typingMessage.content += data.reply[index];
            index++;

            setMessages((prev) => {
              const newMessages = [...prev];
              newMessages[newMessages.length - 1] = { ...typingMessage };
              return newMessages;
            });
          } else {
            clearInterval(interval);
            setAiResponse(data.reply);

            setTimeout(() => {
              setMode("human");
            }, 500);

            if (voiceEnabled) {
              speakText(data.reply);
            }
          }
        }, 60);
      }, 500);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
      setIsLoading(false);
    }
  };

  const handleHumanSubmit = async (response) => {
    if (!response.trim()) return;

    setHumanResponse(response);
    setMessages((prev) => [...prev, { role: "human", content: response }]);

    try {
      setIsLoading(true);
      const comparisonResponse = await fetch("/api/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aiResponse,
          humanResponse: response,
          question: currentQuestion,
        }),
      });

      if (!comparisonResponse.ok) {
        throw new Error(`HTTP error: ${comparisonResponse.status}`);
      }

      const comparisonData = await comparisonResponse.json();
      console.log("Comparison result:", comparisonData);

      setComparisonResults(comparisonData);
      setShowComparison(true);

      // ✅ Add to session history
      const newHistoryItem = {
        question: currentQuestion,
        aiResponse,
        humanResponse: response,
        winner: comparisonData.winner,
        timestamp: new Date().toLocaleString(),
      };

      setSessionHistory((prev) => [newHistoryItem, ...prev]);
    } catch (error) {
      console.error("Comparison error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuestion = () => {
    setMode("ai");
    setMessages([]);
    setAiResponse("");
    setHumanResponse("");
    setShowComparison(false);
    setComparisonResults(null);
    setCurrentQuestion("");
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-gray-100">
          AI vs Human Intelligence
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleVoice}
            className={`px-3 py-1 ${
              voiceEnabled ? "bg-green-600" : "bg-gray-700"
            } hover:bg-gray-600 text-gray-200 rounded-md text-sm`}
          >
            {voiceEnabled ? "Voice ON 🔊" : "Voice OFF 🔇"}
          </button>
          <ModeToggle mode={mode} onToggle={handleToggleMode} />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-xl p-4 max-w-[80%] shadow-lg ${
                  message.role === "user"
                    ? "bg-blue-600 text-white self-end"
                    : message.role === "human"
                    ? "bg-green-600 text-white self-start"
                    : "bg-gray-800 border border-gray-700"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="text-xs text-blue-400 mb-1">AI Response</div>
                )}
                {message.role === "human" && (
                  <div className="text-xs text-green-400 mb-1">
                    Human Response
                  </div>
                )}
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-md max-w-[80%]">
                <div className="text-xs text-blue-400 mb-1">AI Thinking...</div>
                <div className="flex items-center space-x-1">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {showComparison && comparisonResults && (
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-md text-gray-100">
              <h2 className="text-xl font-bold mb-4">Comparison Result</h2>
              <p>
                <strong>Winner:</strong> {comparisonResults.winner}
              </p>
              <p>
                <strong>AI Score:</strong> {comparisonResults.aiScore}
              </p>
              <p>
                <strong>Human Score:</strong> {comparisonResults.humanScore}
              </p>
              <p className="mt-2">
                <strong>Reason:</strong> {comparisonResults.reason}
              </p>
              <button
                onClick={handleNewQuestion}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white"
              >
                Ask New Question
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ✅ Session History */}
      {sessionHistory.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 p-4">
          <h2 className="text-lg font-bold mb-2 text-gray-100">
            Session History
          </h2>
          <div className="space-y-3 max-h-40 overflow-y-auto">
            {sessionHistory.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-gray-700 rounded-md text-gray-200"
              >
                <p>
                  <strong>Q:</strong> {item.question}
                </p>
                <p>
                  <strong>AI:</strong> {item.aiResponse}
                </p>
                <p>
                  <strong>Human:</strong> {item.humanResponse}
                </p>
                <p>
                  <strong>Winner:</strong> {item.winner}
                </p>
                <p className="text-xs text-gray-400">{item.timestamp}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-700 bg-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          {/* ✅ Tone Selector */}
          <div className="mb-4 flex gap-2">
            {["Neutral", "Formal", "Casual", "Funny", "Professional"].map(
              (t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`px-3 py-1 rounded ${
                    tone === t
                      ? "bg-blue-600 text-white"
                      : "bg-gray-700 text-gray-300"
                  } hover:bg-gray-600`}
                >
                  {t}
                </button>
              )
            )}
          </div>

          {mode === "ai" || !aiResponse ? (
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 py-2 px-4 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg font-medium"
                disabled={isLoading}
              >
                Send
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleHumanSubmit(input);
                setInput("");
              }}
              className="flex space-x-4"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter your human response..."
                className="flex-1 py-2 px-4 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg font-medium"
                disabled={isLoading}
              >
                Submit
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
