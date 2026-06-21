import { useState, useRef, useEffect } from "react";
import { askGemini } from "./gemini";


function App() {
  const [command, setCommand] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: " hello jarvis",
      text: "Hello Rakheeb! I am Jarvis. How can I help you today?",
    },
  ]);
  const chatRef = useRef(null);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };
  const addJarvisMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: " hello jarvis",
        text,
      },
    ]);
  };

  const handleCommand = async (text) => {
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: text,
      },
    ]);
    const cmd = text.toLowerCase();

    setCommand(cmd);

    if (cmd.includes("youtube")) {
      speak("Open YouTube");
      window.open("https://www.youtube.com", "_blank");
    } else if (cmd.includes("google")) {
      speak("Open Google");
      window.open("https://www.google.com", "_blank");
    } else if (cmd.includes("github")) {
      speak("Open GitHub");
      window.open("https://github.com", "_blank");
    } else if (cmd.includes("leetcode")) {
      speak("Open LeetCode");
      window.open(
        "https://leetcode.com/u/rakheebshaikh906/",
        "_blank"
      );
    }
    else if (cmd.includes("linkdin")) {
      speak("Open linkdin");
      window.open(
        "www.linkedin.com/in/rakheeb-shaikh-54830b380",
        "_blank"
      );
    }
    else if (cmd.includes("calculator")) {
      addJarvisMessage("Opening Calculator...");
      speak("Opening Calculator");
      window.electronAPI.openApp("calculator");
    }

    else if (cmd.includes("notepad")) {
      addJarvisMessage("Opening Notepad...");
      speak("Opening Notepad");
      window.electronAPI.openApp("notepad");
    }
    else if (cmd.includes("vscode")) {
      addJarvisMessage("Opening VS Code...");
      speak("Opening VS Code");
      window.electronAPI.openApp("vscode");
    } else if (cmd.includes("hello jarvis")) {
      addJarvisMessage(
        "Hello Rakheeb!How can I help you today?"
      );
      speak("Hello Rakheeb! How can I help you today?");
    } else if (cmd.includes("good morning")) {
      addJarvisMessage(
        "Good Morning Rakheeb! Have a productive coding day."
      );
      speak("Good Morning Rakheeb! Have a productive coding day.");
    } else if (cmd.includes("show time")) {
      addJarvisMessage(
        new Date().toLocaleTimeString()
      );
      speak(`The current time is ${new Date().toLocaleTimeString()}`);
    } else if (cmd.includes("show date")) {
      addJarvisMessage(
        new Date().toDateString()
      );
      speak(`The current date is ${new Date().toDateString()}`);
    } else if (cmd.includes("now tell me about virat kohli")) {
      addJarvisMessage(
        "Virat Kohli is an Indian cricketer and former captain of the Indian national team. He is one of the most successful batsmen in the history of cricket."
      );
      speak("Virat Kohli is an Indian cricketer and former captain of the Indian national team. He is one of the most successful batsmen in the history of cricket.");
    }
    else if (cmd.includes("what is the weather today")) {
      addJarvisMessage(
        "The weather is sunny with a high of 35°C and a low of 25°C."
      );
      speak("The weather is sunny with a high of 35°C and a low of 25°C.");
    } else if (cmd.includes("can you tell about myself")) {
      addJarvisMessage(
        "your name is shaikh abdul rakheeb you are a passionate software developer with expertise in software development and a keen interest in AI technologies."

      );
      speak("your name is shaikh abdul rakheeb you are a passionate software developer with expertise in software development and a keen interest in AI technologies.");
    }
    else {
      try {

        addJarvisMessage(" Thinking...");

        const answer = await askGemini(text);

        addJarvisMessage(answer);

        speak(answer);

      } catch (error) {
        console.log(error);
        addJarvisMessage(error.message);
      }
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
  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white px-4">

      <h1 className="text-5xl font-bold mb-8">
        Jarvis AI
      </h1>

      {/* STEP 5 YAHAN ADD KARNA HAI */}
      <div
        ref={chatRef}
        className="w-[700px] h-[350px] bg-slate-900 rounded-xl p-4 overflow-y-auto border border-slate-700"
      >

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${msg.sender === "user"
              ? "justify-end"
              : "justify-start"
              }`}
          >
            <div
              className={`px-4 py-2 rounded-xl max-w-[70%]
            ${msg.sender === "user"
                  ? "bg-blue-600"
                  : "bg-slate-700"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

      </div>

      <button
        onClick={startListening}
        className="mt-4 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-xl"
      >
        Start Listening
      </button>

      <div className="mt-8 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && input.trim()) {
              handleCommand(input);
              setInput("");
            }
          }}
          placeholder="Message Jarvis..."
          className="w-80 px-4 py-3 rounded-xl bg-white text-black"
        />

        <button
          onClick={() => {
            handleCommand(input);
            setInput("");
          }}
          className="bg-green-600 hover:bg-green-700 px-5 py-3 rounded-xl"
        >
          Send
        </button>
      </div>

    </div>
  );
}

export default App;