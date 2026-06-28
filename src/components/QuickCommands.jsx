import { motion } from "framer-motion";
import { Cloud, AppWindow, Calculator, Video, BrainCircuit } from "lucide-react";

const COMMANDS = [
    { icon: Cloud, text: "weather in [city]", run: "weather in mumbai" },
    { icon: AppWindow, text: "open [app]", run: "open notepad" },
    { icon: Calculator, text: "calculate [expression]", run: "open calculator" },
    { icon: Video, text: "search youtube [query]", run: "youtube" },
    { icon: BrainCircuit, text: "remember that [text]", run: "remember that " },
];

export default function QuickCommands({ onRun }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel glow-border p-3"
        >
            <div className="text-[11px] tracking-[2px] mb-2" style={{ color: "var(--jarvis-gold-dim)" }}>
                QUICK COMMANDS
            </div>
            <div className="flex flex-col gap-1.5">
                {COMMANDS.map((c) => (
                    <motion.button
                        key={c.text}
                        whileHover={{ x: 3 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => onRun(c.run)}
                        className="btn-ghost flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border text-left"
                        style={{ borderColor: "var(--jarvis-gold-dimmer)", background: "rgba(240,184,64,0.02)" }}
                    >
                        <c.icon size={13} style={{ color: "var(--jarvis-gold)" }} />
                        <span className="text-[11px]" style={{ color: "#cdb985" }}>{c.text}</span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );
}