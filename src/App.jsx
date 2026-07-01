import { useState, useRef, useEffect, useCallback } from "react";
import { askGemini, askGeminiWithRetry } from "./gemini";
import { getWeather } from "./weather";
import { askGroq } from "./groq";
//import { searchWeb } from "./search";
import { searchAndSummarize } from "./Search";

import ParticlesBackground from "./components/ParticlesBackground";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ChatPanel from "./components/ChatPanel";
import InputBar from "./components/InputBar";
import SystemMonitor from "./components/SystemMonitor";
import QuickCommands from "./components/QuickCommands";
import AICore from "./components/AICore";
import { getWikipediaData } from "./wikipedia";
import { detectIntent } from "./brain/brain";
import { handleBrowserCommand } from "./agents/browserAgent";
import { decideWebsite } from "./agents/decisionAgent";
import { handleShoppingCommand } from "./agents/shoppingAgent";



function App() {
  const [command, setCommand] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "jarvis",
      text: "Hello Rakheeb! I am Jarvis. How can I help you today?",
    },
  ]);
  const chatRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [activeNav, setActiveNav] = useState("home");
  const [clock, setClock] = useState(
    new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
  const [ramInfo, setRamInfo] = useState(null);
  const [diskInfo, setDiskInfo] = useState(null);

  // live clock, matches the screenshot's "local time" stat
  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const addJarvisMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
        sender: "jarvis",
        text,
      },
    ]);
  };

  function addRichMessage(data) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sender: "jarvis",
        type: "rich",
        ...data,
      },
    ]);
  }

  const addWeatherMessage = (weatherData, city) => {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
        sender: "jarvis",
        type: "weather",
        weatherData,
        city,
      },
    ]);
  };

  const downloadChat = () => {
    const chatText = messages
      .map((msg) => `${msg.sender === "user" ? "user" : "hello jarvis"}: ${msg.text ?? "[weather card]"}`)
      .join("\n\n");

    const blob = new Blob([chatText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {

    if (!window.electronAPI?.getRamInfo)
      return;

    const loadRam = async () => {

      const data =
        await window.electronAPI.getRamInfo();

      setRamInfo(data);
    };

    loadRam();

    const interval =
      setInterval(loadRam, 5000);

    return () => clearInterval(interval);

  }, []);
  useEffect(() => {

    if (!window.electronAPI?.getDiskInfo)
      return;

    const loadDisk = async () => {

      const data =
        await window.electronAPI.getDiskInfo();

      console.log("DISK DATA:", data);

      setDiskInfo(data);
    };

    loadDisk();

    const interval =
      setInterval(loadDisk, 5000);

    return () => clearInterval(interval);

  }, []);

  function needsWebSearch(text) {
    const query = text.toLowerCase();

    const keywords = [
      "latest",
      "current",
      "today",
      "news",
      "live",
      "price",
      "score",
      "winner",
      "won",
      "president",
      "prime minister",
      "election",
      "stock",
      "bitcoin",
      "gold",
      "ipl",
      "world cup",
      "yesterday",
      "this week",
      "2024",
      "2025",
      "2026",
      "2027",
      "2028",
      "2029"

    ];

    return keywords.some((word) => query.includes(word));
  }

  const handleCommand = async (text) => {
    const intent = detectIntent(text);

    console.log(intent);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now() + Math.random(),
        sender: "user",
        text: text,
      },
    ]);
    const cmd = text.toLowerCase();


    setCommand(cmd);
    const browserResult = handleBrowserCommand(text);
    const shoppingResult = handleShoppingCommand(text);

    console.log(shoppingResult);

    if (shoppingResult) {

      window.open(shoppingResult.amazonUrl, "_blank");
      window.open(shoppingResult.flipkartUrl, "_blank");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "jarvis",
          type: "shopping",

          category: shoppingResult.category,
          budget: shoppingResult.budget,

          text: `Searching best ${shoppingResult.category} under ₹${shoppingResult.budget}`
        }
      ]);

      return;
    } else if (browserResult) {
      window.open(browserResult.url, "_blank");

      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: "jarvis",
          type: "browser",

          website: browserResult.website,
          action: browserResult.action,
          query: browserResult.query,

          text: browserResult.message,
        },
      ]);
      return;
    } else if (cmd.includes("open youtube")) {
      speak("Open YouTube");
      window.open("https://www.youtube.com", "_blank");
    } else if (cmd.includes("open  google")) {
      speak("Open Google");
      window.open("https://www.google.com", "_blank");
    } else if (cmd.includes(" open github")) {
      speak("Open GitHub");
      window.open("https://github.com", "_blank");
    } else if (cmd.includes("open leetcode")) {
      speak("Open LeetCode");
      window.open("https://leetcode.com/u/rakheebshaikh906/", "_blank");
    } else if (cmd.includes("linkdin")) {
      speak("Open linkdin");
      window.open("https://www.linkedin.com/in/rakheeb-shaikh-54830b380", "_blank");
    } else if (cmd.includes("open calculator")) {
      addJarvisMessage("Opening Calculator...");
      speak("Opening Calculator");
      window.electronAPI?.openApp("calculator");
    } else if (cmd.includes("open notepad")) {
      addJarvisMessage("Opening Notepad...");
      speak("Opening Notepad");
      window.electronAPI?.openApp("notepad");
    } else if (cmd.includes("vscode")) {
      addJarvisMessage("Opening VS Code...");
      speak("Opening VS Code");
      window.electronAPI?.openApp("open vscode");
    } else if (cmd.includes("open chrome")) {
      addJarvisMessage("Opening Chrome...");
      speak("Opening Chrome");
      window.electronAPI?.openApp("chrome");
    } else if (cmd.includes("open explorer")) {
      addJarvisMessage("Opening File Explorer...");
      speak("Opening File Explorer");
      window.electronAPI?.openApp("explorer");
    } else if (cmd.includes("spotify")) {
      addJarvisMessage("Opening Spotify...");
      speak("Opening Spotify");
      window.electronAPI?.openApp("spotify");
    } else if (cmd.includes("hello jarvis")) {
      const hour = new Date().getHours();
      let greeting = "Hello Rakheeb";
      if (hour < 12) greeting = "Good Morning Rakheeb";
      else if (hour < 18) greeting = "Good Afternoon Rakheeb";
      else greeting = "Good Evening Rakheeb";

      addJarvisMessage(`${greeting}! How can I help you today?`);
      speak(`${greeting}! How can I help you today?`);
    } else if (cmd.includes("good morning")) {
      addJarvisMessage("Good Morning Rakheeb! Have a productive coding day.");
      speak("Good Morning Rakheeb! Have a productive coding day.");
    } else if (cmd.includes("show time")) {
      addJarvisMessage(new Date().toLocaleTimeString());
      speak(`The current time is ${new Date().toLocaleTimeString()}`);
    } else if (cmd.includes("show date")) {
      addJarvisMessage(new Date().toDateString());
      speak(`The current date is ${new Date().toDateString()}`);
    } else if (cmd.includes("now tell me about virat kohli")) {
      const msg =
        "Virat Kohli is an Indian cricketer and former captain of the Indian national team. He is one of the most successful batsmen in the history of cricket.";
      addJarvisMessage(msg);
      speak(msg);
    } else if (cmd.includes("what is the weather today")) {
      const msg = "The weather is sunny with a high of 35°C and a low of 25°C.";
      addJarvisMessage(msg);
      speak(msg);
    } else if (cmd.includes("can you tell about myself")) {
      const msg =
        "your name is shaikh abdul rakheeb you are a passionate software developer with expertise in software development and a keen interest in AI technologies.";
      addJarvisMessage(msg);
      speak(msg);
    } else if (cmd.startsWith("my name is")) {
      const name = text.replace(/my name is/i, "").trim();
      localStorage.setItem("userName", name);
      const msg = `Okay, I will remember that your name is ${name}`;
      addJarvisMessage(msg);
      speak(msg);
    } else if (cmd.includes("what is my name")) {
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        addJarvisMessage(`Your name is ${savedName}`);
        speak(`Your name is ${savedName}`);
      } else {
        addJarvisMessage("I don't know your name yet.");
        speak("I don't know your name yet.");
      }
    } else if (cmd.startsWith("remember that")) {
      const memory = text.replace(/remember that/i, "").trim();
      let memories = JSON.parse(localStorage.getItem("memories")) || {};
      const parts = memory.split(" is ");

      if (parts.length >= 2) {
        const key = parts[0].trim().toLowerCase();
        const value = parts.slice(1).join(" is ").trim();
        memories[key] = value;
        localStorage.setItem("memories", JSON.stringify(memories));

        addJarvisMessage(`Okay, I'll remember that ${key} is ${value}`);
        speak(`Okay, I'll remember that ${key} is ${value}`);
      }
    } else if (cmd.startsWith("what is my")) {

      const key = ("my " + cmd
        .replace("what is my", "")
        .replace("?", "")
        .trim())
        .toLowerCase();

      const memories =
        JSON.parse(localStorage.getItem("memories")) || {};

      if (memories[key]) {

        addJarvisMessage(
          `Your ${key.replace("my ", "")} is ${memories[key]}`
        );

        speak(
          `Your ${key.replace("my ", "")} is ${memories[key]}`
        );

      } else {

        addJarvisMessage(
          `I don't know your ${key.replace("my ", "")} yet.`
        );

        speak(
          `I don't know your ${key.replace("my ", "")} yet.`
        );
      }
    } else if (cmd.includes("weather in")) {
      try {
        const city = text.toLowerCase().replace("weather in", "").trim();
        const weatherData = await getWeather(city);

        addWeatherMessage(weatherData, city);
        speak(
          `${city} temperature is ${weatherData.current.temp_c}°C with ${weatherData.current.condition.text}`
        );
      } catch (error) {
        console.error("Weather Error:", error);
        addJarvisMessage("Unable to fetch weather data.");
      }
    } else if (intent === "wiki") {

      try {

        setLoading(true);

        let query = text
          .replace(/^who is/i, "")


          .replace(/^information about/i, "")
          .replace(/^show me/i, "")

          .trim();

        const wiki = await getWikipediaData(query);

        if (wiki) {

          addRichMessage({
            title: wiki.title,
            summary: wiki.summary,
            image: wiki.image,
            website: wiki.wikipedia,
          });

          speak(`Here is information about ${wiki.title}`);

        } else {

          throw new Error("Wikipedia page not found");

        }

      } catch (error) {

        console.log("Wikipedia not found. Falling back to AI...");

        const recentHistory = messages
          .slice(-4)
          .map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            text: msg.text || "",
          }));

        const answer = await askGroq(text, recentHistory);

        addJarvisMessage(answer);

        speak(answer);

      } finally {

        setLoading(false);

      }
    } else if (
      needsWebSearch(text)
    ) {

      try {

        setLoading(true);

        const answer = await searchAndSummarize(text);

        addJarvisMessage(answer);



      } catch (err) {

        console.error(err);

        addJarvisMessage(
          "Unable to search the internet."
        );
        setLoading(false);

      }

    }
    else {
      const recentHistory = messages
        .slice(-4)
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          text: msg.text || "",
        }));

      try {

        setLoading(true);

        const answer = await askGeminiWithRetry(text, recentHistory);

        addJarvisMessage(answer);
        speak(answer);

      } catch (error) {

        console.log("Gemini Failed. Switching to Groq...");

        try {

          const answer = await askGroq(text, recentHistory);

          addJarvisMessage(answer);


        } catch (groqError) {

          console.error("GROQ ERROR:", groqError);

          addJarvisMessage("Both AI services are currently unavailable.");
        }

      } finally {

        setLoading(false);

      }
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      console.log("Listening...");
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("Recognition Ended");
    };

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript.toLowerCase();
      console.log("Recognized:", text);
      handleCommand(text);
    };

    recognition.onerror = (event) => {
      setIsListening(false);
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
  }, [messages, loading]);

  const handleSend = useCallback(() => {
    if (!input.trim()) return;
    handleCommand(input);
    setInput("");
  }, [input]);

  const handleQuickCommand = (text) => {
    if (text.endsWith("[text]") || text.trim() === "remember that") {
      setInput("remember that ");
      return;
    }
    handleCommand(text);
  };

  return (
    <div
      className="h-screen overflow-hidden relative p-4 md:p-5"
      style={{ background: "var(--jarvis-bg)" }}
    >
      <ParticlesBackground />
      <div className="relative z-10 max-w-[1400px] mx-auto h-full flex flex-col">
        <div className="shrink-0">
          <Header messageCount={messages.length} time={clock} />
        </div>

        <div className="flex flex-col lg:flex-row gap-5 flex-1 min-h-0 overflow-hidden mt-5">
          <div className="no-scrollbar overflow-y-auto min-h-0 lg:shrink-0">
            <Sidebar
              activeId={activeNav}
              onSelect={setActiveNav}
              onCommand={handleCommand}
              lastCommand={command || "awaiting input"}
            />
          </div>

          <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
            <ChatPanel messages={messages} loading={loading} chatRef={chatRef} />
            <InputBar
              input={input}
              setInput={setInput}
              onSend={handleSend}
              onMic={startListening}
              isListening={isListening}
              onDownload={downloadChat}
            />
          </div>

          <div className="no-scrollbar flex flex-col gap-3 w-full lg:w-72 shrink-0 min-h-0 overflow-y-auto">
            <SystemMonitor
              ramInfo={ramInfo}
              diskInfo={diskInfo}
            />
            <QuickCommands onRun={handleQuickCommand} />
            <AICore />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;