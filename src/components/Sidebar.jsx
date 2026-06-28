import { motion } from "framer-motion";
import {
    Home,
    Cloud,
    Calculator,
    Code2,
    StickyNote,
    Video,
    MessageCircle,
    Settings,
    Menu,
} from "lucide-react";

const NAV_ITEMS = [
    { id: "home", label: "Home", sub: "Dashboard", icon: Home, command: "hello jarvis" },
    { id: "weather", label: "Weather", sub: "Live Updates", icon: Cloud, command: "weather in mumbai" },
    { id: "calculator", label: "Calculator", sub: "Compute Engine", icon: Calculator, command: "open calculator" },
    { id: "vscode", label: "VS Code", sub: "Code Editor", icon: Code2, command: "open vscode" },
    { id: "notepad", label: "Notepad", sub: "Quick Notes", icon: StickyNote, command: "open notepad" },
    { id: "youtube", label: "YouTube", sub: "Video Search", icon: Video, command: "open youtube" },
    { id: "aichat", label: "AI Chat", sub: "Gemini AI", icon: MessageCircle, command: null },
    { id: "settings", label: "Settings", sub: "Preferences", icon: Settings, command: null },
];

export default function Sidebar({ activeId, onSelect, onCommand, lastCommand }) {
    return (
        <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="glass-panel flex flex-col p-3 w-full lg:w-64 shrink-0"
        >
            <div className="flex items-center gap-2 px-1 pb-2 mb-1.5 border-b" style={{ borderColor: "var(--jarvis-gold-dimmer)" }}>
                <Menu size={14} style={{ color: "var(--jarvis-gold)" }} />
                <span className="text-[11px] tracking-[3px]" style={{ color: "var(--jarvis-gold-dim)" }}>
                    SYSTEM MENU
                </span>
            </div>

            <nav className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeId === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onSelect(item.id);
                                if (item.command) onCommand(item.command);
                            }}
                            className={`nav-item flex items-center gap-2.5 px-2.5 py-1.5 rounded-md border border-transparent text-left ${isActive ? "active" : ""
                                }`}
                        >
                            <Icon size={15} style={{ color: isActive ? "var(--jarvis-gold-bright)" : "var(--jarvis-gold-dim)" }} />
                            <div>
                                <div className="text-[12px] font-semibold leading-tight" style={{ color: isActive ? "var(--jarvis-gold-bright)" : "#cdb985" }}>
                                    {item.label}
                                </div>
                                <div className="text-[9px] tracking-wide leading-tight" style={{ color: "var(--jarvis-gold-dim)" }}>
                                    {item.sub}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </nav>

            {/* decorative mini terminal */}
            <div className="mt-3 glass-panel !rounded-lg p-2.5 relative">
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[9.5px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dim)" }}>
                        TERMINAL
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--jarvis-gold-dimmer)" }}>×</span>
                </div>
                <div className="text-[10.5px] leading-relaxed" style={{ color: "#3ddc6e" }}>
                    rakheebShaikh@jarvis:~$<span className="opacity-70"> {lastCommand}</span>
                    <span className="inline-block w-[6px] h-[12px] ml-1 align-middle" style={{ background: "#3ddc6e", animation: "jarvis-typing 1s steps(2) infinite" }} />
                </div>
            </div>
        </motion.aside>
    );
}