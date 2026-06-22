import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import WeatherCard from "./WeatherCard";

export default function MessageBubble({ msg }) {
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
    }

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
                {msg.text}
            </div>
        </motion.div>
    );
}
