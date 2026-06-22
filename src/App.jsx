import { useState, useRef, useEffect } from "react";
import { askGemini } from "./gemini";
import { getWeather } from "./weather";

console.log(import.meta.env.VITE_WEATHER_API_KEY);



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
  const [loading, setLoading] = useState(false);



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
  const downloadChat = () => {

    const chatText = messages
      .map(msg => `${msg.sender}: ${msg.text}`)
      .join("\n\n");

    const blob = new Blob(
      [chatText],
      { type: "text/plain" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "chat.txt";

    a.click();

    URL.revokeObjectURL(url);
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
        "https://www.linkedin.com/in/rakheeb-shaikh-54830b380",
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
    } else if (cmd.includes("chrome")) {
      addJarvisMessage("Opening Chrome...");
      speak("Opening Chrome");
      window.electronAPI.openApp("chrome");
    } else if (cmd.includes("explorer")) {
      addJarvisMessage("Opening File Explorer...");
      speak("Opening File Explorer");
      window.electronAPI.openApp("explorer");
    } else if (cmd.includes("spotify")) {
      addJarvisMessage("Opening Spotify...");
      speak("Opening Spotify");
      window.electronAPI.openApp("spotify");
    }
    else if (cmd.includes("hello jarvis")) {

      const hour = new Date().getHours();

      let greeting = "Hello Rakheeb";

      if (hour < 12) {
        greeting = "Good Morning Rakheeb";
      } else if (hour < 18) {
        greeting = "Good Afternoon Rakheeb";
      } else {
        greeting = "Good Evening Rakheeb";
      }

      addJarvisMessage(`${greeting}! How can I help you today?`);

      speak(`${greeting}! How can I help you today?`);
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
    } else if (cmd.startsWith("my name is")) {

      const name = text.replace(/my name is/i, "").trim();

      localStorage.setItem("userName", name);

      addJarvisMessage(
        `Okay, I will remember that your name is ${name}`
      );

      speak(
        `Okay, I will remember that your name is ${name}`
      );
    }
    else if (cmd.includes("what is my name")) {

      const savedName = localStorage.getItem("userName");

      if (savedName) {

        addJarvisMessage(
          `Your name is ${savedName}`
        );

        speak(
          `Your name is ${savedName}`
        );

      } else {

        addJarvisMessage(
          "I don't know your name yet."
        );

        speak(
          "I don't know your name yet."
        );
      }
    } else if (cmd.startsWith("remember that")) {

      const memory = text.replace(/remember that/i, "").trim();

      let memories =
        JSON.parse(localStorage.getItem("memories")) || {};

      const parts = memory.split(" is ");

      if (parts.length >= 2) {

        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(" is ").trim();

        memories[key] = value;

        localStorage.setItem(
          "memories",
          JSON.stringify(memories)
        );

        addJarvisMessage(
          `Okay, I'll remember that ${key} is ${value}`
        );

        speak(
          `Okay, I'll remember that ${key} is ${value}`
        );
      }
    } else if (cmd.startsWith("what is my")) {

      const key = cmd
        .replace("what is my", "")
        .replace("?", "")
        .trim();

      const memories =
        JSON.parse(localStorage.getItem("memories")) || {};

      if (memories[key]) {

        addJarvisMessage(
          `Your ${key} is ${memories[key]}`
        );

        speak(
          `Your ${key} is ${memories[key]}`
        );

      } else {

        addJarvisMessage(
          `I don't know your ${key} yet.`
        );

        speak(
          `I don't know your ${key} yet.`
        );
      }
    } else if (cmd.startsWith("what is my")) {

      const key = ("my " + cmd
        .replace("what is my", "")
        .replace("?", "")
        .trim()).toLowerCase();

      console.log("Searching Key:", key);

      const memories =
        JSON.parse(localStorage.getItem("memories")) || {};

      console.log("All Memories:", memories);

    } else if (cmd.includes("weather in")) {
      try {
        const city = text
          .toLowerCase()
          .replace("weather in", "")
          .trim();

        const weatherData = await getWeather(city);

        // WeatherAPI format: weatherData.current.temp_c
        const message = `${city} temperature is ${weatherData.current.temp_c}°C with ${weatherData.current.condition.text}`;

        addJarvisMessage(message);
        speak(message);

      } catch (error) {
        console.error("Weather Error:", error);
        addJarvisMessage("Unable to fetch weather data.");
      }
    }
    else {
      try {

        setLoading(true);

        const answer = await askGemini(text);

        addJarvisMessage(answer);

        speak(answer);
        setLoading(false);


      } catch (error) {
        setLoading(false);
        console.log(error);
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

  const S = {
    wrap: { minHeight: "100vh", background: "#070503", padding: "20px", fontFamily: "'Courier New', monospace", position: "relative" },
    gridBg: { position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(220,160,50,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220,160,50,0.05) 1px, transparent 1px)", backgroundSize: "32px 32px", pointerEvents: "none", zIndex: 0 },
    inner: { position: "relative", zIndex: 1, maxWidth: "720px", margin: "0 auto" },
    hdr: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "18px", paddingBottom: "14px", borderBottom: "0.5px solid #3d2e10" },
    hdrLeft: { display: "flex", alignItems: "center", gap: "14px" },
    hexOuter: { width: "38px", height: "38px", background: "#e0a030", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)", display: "flex", alignItems: "center", justifyContent: "center" },
    hexInner: { width: "22px", height: "22px", background: "#070503", clipPath: "polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)" },
    brand: { color: "#f0b840", fontSize: "20px", letterSpacing: "6px", fontWeight: "700" },
    brandSub: { color: "#8a6830", fontSize: "10px", letterSpacing: "3px", marginTop: "2px" },
    hdrRight: { display: "flex", gap: "16px" },
    statVal: { color: "#f0b840", fontSize: "16px", fontWeight: "700", textAlign: "right" },
    statLbl: { color: "#7a5820", fontSize: "9px", letterSpacing: "2px", textAlign: "right" },
    promptLine: { color: "#7a5820", fontSize: "11px", marginBottom: "10px", letterSpacing: "1px" },
    promptSpan: { color: "#f0b840" },
    chatWin: { background: "#050402", border: "0.5px solid #3d2e10", borderRadius: "8px", height: "360px", overflowY: "auto", padding: "14px", marginBottom: "14px", display: "flex", flexDirection: "column", gap: "10px" },
    msgUser: { display: "flex", flexDirection: "column", alignItems: "flex-end" },
    msgJarvis: { display: "flex", flexDirection: "column", alignItems: "flex-start" },
    lblUser: { fontSize: "9px", letterSpacing: "3px", marginBottom: "3px", color: "#8a6830" },
    lblJarvis: { fontSize: "9px", letterSpacing: "3px", marginBottom: "3px", color: "#c08828", display: "flex", alignItems: "center", gap: "6px" },
    bubbleUser: { padding: "10px 14px", fontSize: "13px", lineHeight: "1.75", maxWidth: "82%", background: "#1f1608", border: "0.5px solid #5a3e18", borderRadius: "8px 2px 8px 8px", color: "#f5cc70" },
    bubbleJarvis: { padding: "10px 14px", fontSize: "13px", lineHeight: "1.75", maxWidth: "82%", background: "#110e06", border: "0.5px solid #4a3414", borderRadius: "2px 8px 8px 8px", color: "#f0e0b0" },
    irow: { display: "flex", gap: "8px", marginBottom: "12px" },
    micBtn: { background: "transparent", border: "0.5px solid #5a3e18", color: "#c08828", width: "42px", borderRadius: "4px", cursor: "pointer", fontSize: "18px", flexShrink: 0 },
    textInput: { flex: 1, background: "#050402", border: "0.5px solid #5a3e18", borderRadius: "4px", padding: "10px 13px", fontSize: "13px", color: "#f0e0b0", fontFamily: "'Courier New', monospace", outline: "none" },
    execBtn: { background: "#e0a030", border: "0.5px solid #e0a030", color: "#070503", borderRadius: "4px", padding: "10px 18px", fontSize: "10px", fontFamily: "'Courier New', monospace", letterSpacing: "2px", fontWeight: "700", cursor: "pointer", flexShrink: 0 },
    ftr: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    ftrLeft: { display: "flex", gap: "20px" },
    ftrInfo: { fontSize: "9px", color: "#4a3010", letterSpacing: "2px" },
    ftrInfoSpan: { color: "#a07030" },
    dlBtn: { background: "transparent", border: "0.5px solid #3d2e10", color: "#8a6830", fontSize: "10px", padding: "6px 12px", borderRadius: "4px", fontFamily: "'Courier New', monospace", cursor: "pointer", letterSpacing: "1px" },
  };

  return (
    <div style={S.wrap}>
      <div style={S.gridBg} />
      <div style={S.inner}>

        {/* header */}
        <div style={S.hdr}>
          <div style={S.hdrLeft}>
            <div style={S.hexOuter}><div style={S.hexInner} /></div>
            <div>
              <div style={S.brand}>JARVIS</div>
              <div style={S.brandSub}>autonomous intelligence system</div>
            </div>
          </div>
          <div style={S.hdrRight}>
            <div>
              <div style={S.statVal}>{new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</div>
              <div style={S.statLbl}>local time</div>
            </div>
            <div>
              <div style={S.statVal}>{String(messages.length).padStart(2, "0")}</div>
              <div style={S.statLbl}>messages</div>
            </div>
          </div>
        </div>

        {/* session line */}
        <div style={S.promptLine}>
          {"// "}<span style={S.promptSpan}>rakheeb@jarvis</span>{" ~ active session"}
        </div>

        {/* chat window */}
        <div ref={chatRef} style={S.chatWin}>
          {messages.map((msg, i) => (
            <div key={i} style={msg.sender === "user" ? S.msgUser : S.msgJarvis}>
              <div style={msg.sender === "user" ? S.lblUser : S.lblJarvis}>
                {msg.sender === "user" ? "YOU" : "JARVIS OUTPUT"}
              </div>
              <div style={msg.sender === "user" ? S.bubbleUser : S.bubbleJarvis}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", gap: "4px", padding: "8px 0" }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: "5px", height: "5px", background: "#f0b840", borderRadius: "50%", display: "inline-block" }} />
              ))}
            </div>
          )}
        </div>

        {/* input row */}
        <div style={S.irow}>
          <button style={S.micBtn} onClick={startListening} title="Voice input">🎙</button>
          <input
            style={S.textInput}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && input.trim()) {
                handleCommand(input);
                setInput("");
              }
            }}
            placeholder="$ enter command..."
          />
          <button style={S.execBtn} onClick={() => { if (input.trim()) { handleCommand(input); setInput(""); } }}>
            SEND
          </button>
        </div>

        {/* footer */}
        <div style={S.ftr}>
          <div style={S.ftrLeft}>
            <div style={S.ftrInfo}>build <span style={S.ftrInfoSpan}>v3.1.0</span></div>
            <div style={S.ftrInfo}>status <span style={S.ftrInfoSpan}>online</span></div>
          </div>
          <button style={S.dlBtn} onClick={downloadChat}>↓ export log</button>
        </div>

      </div>
    </div>
  );
}

export default App;