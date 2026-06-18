import { useState } from "react";

function App() {
  const [command, setCommand] = useState("");
  const [input, setInput] = useState("");

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const handleCommand = (text) => {
    const cmd = text.toLowerCase();

    setCommand(cmd);

    if (cmd.includes("youtube")) {
      speak("Opening YouTube");
      window.open("https://www.youtube.com", "_blank");
    } else if (cmd.includes("google")) {
      speak("Opening Google");
      window.open("https://www.google.com", "_blank");
    } else if (cmd.includes("github")) {
      speak("Opening GitHub");
      window.open("https://github.com", "_blank");
    } else if (cmd.includes("leetcode")) {
      speak("Opening LeetCode");
      window.open(
        "https://leetcode.com/u/rakheebshaikh906/",
        "_blank"
      );
    } else {
      speak(`You said ${cmd}`);
    }
  };

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        "Speech Recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;


    recognition.onstart = () => {
      console.log("Listening...");
    };

    recognition.onend = () => {
      console.log("Recognition Ended");
    };

    recognition.onerror = (event) => {
      console.log("Speech Error:", event.error);
    };

    recognition.onresult = (event) => {
      const text =
        event.results[0][0].transcript.toLowerCase();

      console.log("Recognized:", text);

      handleCommand(text);
    };

    recognition.onerror = (event) => {
      console.log("Error:", event.error);
      alert(`Error: ${event.error}`);
    };

    recognition.start();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">

      <h1 className="text-5xl font-bold mb-8">
        Jarvis AI
      </h1>

      <button
        onClick={startListening}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl text-lg font-semibold transition"
      >
        Start Listening
      </button>

      <div className="mt-8 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your command..."
          className="w-80 px-4 py-3 rounded-xl bg-white text-black border-2 border-gray-400 focus:border-blue-500 focus:outline-none"
        />

        <button
          onClick={() => {
            if (input.trim() !== "") {
              handleCommand(input);
              setInput("");
            }
          }}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl font-semibold"
        >
          Send
        </button>
      </div>

      <div className="mt-8 bg-slate-900 p-4 rounded-xl w-[450px] text-center border border-slate-700">
        <p className="text-gray-400">
          Last Command
        </p>

        <h2 className="text-xl font-semibold mt-2">
          {command || "Waiting for command..."}
        </h2>
      </div>

    </div>
  );
}

export default App;