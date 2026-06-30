import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import WeatherCard from "./WeatherCard";
import RichResponseCard from "./RichResponseCard";
import { Volume2, Square, Copy, Check } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function MessageBubble({ msg }) {

    const [copied, setCopied] = useState(false);
    const [speaking, setSpeaking] = useState(false);

    const isUser = msg.sender === "user";

    if (msg.type === "weather") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start"
            >
                <WeatherCard data={msg.weatherData} city={msg.city} />
            </motion.div>
        );
    } if (msg.type === "browser") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
            >
                <div
                    className="max-w-md w-full rounded-xl border p-4"
                    style={{
                        background: "#0d0a05",
                        border: "1px solid #4a3414",
                    }}
                >
                    <div
                        className="text-sm font-bold mb-3"
                        style={{ color: "var(--jarvis-gold)" }}
                    >
                        Browser Agent
                    </div>

                    <div className="space-y-2 text-sm">
                        <p>
                            <strong>Website:</strong> {msg.website}
                        </p>

                        <p>
                            <strong>Action:</strong> {msg.action}
                        </p>

                        <p>
                            <strong>Query:</strong> {msg.query}
                        </p>

                        <p style={{ color: "#e7dfcb" }}>
                            task Completed.
                        </p>
                    </div>
                </div>
            </motion.div>
        );
    }
    if (msg.type === "rich") {
        return (
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-start"
            >
                <RichResponseCard data={msg} />
            </motion.div>
        );
    }

    const handleSpeak = () => {

        speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(msg.text);

        utterance.rate = 1;

        utterance.pitch = 1;

        utterance.onstart = () => setSpeaking(true);

        utterance.onend = () => setSpeaking(false);

        speechSynthesis.speak(utterance);

    };

    const stopSpeaking = () => {

        speechSynthesis.cancel();

        setSpeaking(false);

    };

    const copyMessage = async () => {

        await navigator.clipboard.writeText(msg.text);

        setCopied(true);

        setTimeout(() => {

            setCopied(false);

        }, 2000);

    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
        >
            <div
                className="text-[9px] tracking-[3px] mb-1 flex items-center gap-1.5"
                style={{ color: isUser ? "var(--jarvis-gold-dim)" : "#c08828" }}
            >
                {!isUser && <Sparkles size={10} />}
                {isUser ? "YOU" : "JARVIS OUTPUT"}
            </div>
            <div
                className="px-3.5 py-2.5 text-[13px] leading-relaxed max-w-[82%] rounded-lg"
                style={
                    isUser
                        ? {
                            background: "#1f1608",
                            border: "0.5px solid #5a3e18",
                            borderRadius: "10px 3px 10px 10px",
                            color: "#f5cc70",
                        }
                        : {
                            background: "#110e06",
                            border: "0.5px solid #4a3414",
                            borderRadius: "3px 10px 10px 10px",
                            color: "#f0e0b0",
                        }
                }
            >


                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        code({ node, inline, className, children, ...props }) {

                            const match = /language-(\w+)/.exec(className || "");

                            return !inline && match ? (

                                <SyntaxHighlighter
                                    style={oneDark}
                                    language={match[1]}
                                    PreTag="div"
                                    customStyle={{
                                        borderRadius: "10px",
                                        fontSize: "13px",
                                        marginTop: "12px",
                                        marginBottom: "12px",
                                    }}
                                    {...props}
                                >
                                    {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>

                            ) : (

                                <code
                                    className={className}
                                    {...props}
                                >
                                    {children}
                                </code>

                            );
                        },
                    }}
                >
                    {msg.text}
                </ReactMarkdown>
            </div>
            {!isUser && (

                <div className="flex gap-3 mt-2">

                    <button
                        onClick={speaking ? stopSpeaking : handleSpeak}
                        className="p-2 rounded-lg transition-all hover:bg-[#2b1d09]"
                    >
                        {speaking ? (
                            <Square size={18} />
                        ) : (
                            <Volume2 size={18} />
                        )}
                    </button>
                    <button
                        onClick={copyMessage}
                        className="p-2 rounded-lg transition-all hover:bg-[#2b1d09]"
                    >
                        {copied ? (
                            <Check size={18} />
                        ) : (
                            <Copy size={18} />
                        )}
                    </button>

                </div>

            )}
        </motion.div>
    );
}
