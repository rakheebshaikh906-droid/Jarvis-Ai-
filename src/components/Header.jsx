import { motion } from "framer-motion";
import { Activity, MessageSquare, Clock3 } from "lucide-react";

export default function Header({ messageCount, time }) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel glow-border flex flex-wrap items-center justify-between gap-4 px-5 py-4 mb-5"
        >
            {/* left: hex logo + brand */}
            <div className="flex items-center gap-3">
                <motion.div
                    whileHover={{ rotate: 10, scale: 1.05 }}
                    className="hex-clip w-10 h-10 flex items-center justify-center"
                    style={{ background: "var(--jarvis-gold)" }}
                >
                    <div className="hex-clip w-6 h-6" style={{ background: "var(--jarvis-bg)" }} />
                </motion.div>
                <div>
                    <div className="glow-text text-xl font-bold tracking-[6px] leading-none">JARVIS</div>
                    <div className="text-[10px] tracking-[3px] mt-1" style={{ color: "var(--jarvis-gold-dim)" }}>
                        AUTONOMOUS INTELLIGENCE SYSTEM
                    </div>
                </div>
            </div>

            {/* center: status pill (hidden on small screens, shown stacked) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border" style={{ borderColor: "var(--jarvis-gold-dimmer)" }}>
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full opacity-60 animate-ping" style={{ background: "#3ddc6e" }} />
                    <span className="relative inline-flex rounded-full h-2 w-2 glow-dot" style={{ background: "#3ddc6e", color: "#3ddc6e" }} />
                </span>
                <span className="text-[10px] tracking-[2px]" style={{ color: "#7adf99" }}>SYSTEM ONLINE</span>
                <div className="flex items-end gap-[2px] h-3 ml-2">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <span
                            key={i}
                            className="wave-bar w-[2px] rounded-sm"
                            style={{ background: "var(--jarvis-gold)", animationDelay: `${i * 0.12}s` }}
                        />
                    ))}
                </div>
            </div>

            {/* right: time + message stats */}
            <div className="flex items-center gap-5">
                <div className="text-right">
                    <div className="glow-text text-base font-bold flex items-center gap-1.5 justify-end">
                        <Clock3 size={14} className="opacity-70" />
                        {time}
                    </div>
                    <div className="text-[9px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dim)" }}>LOCAL TIME</div>
                </div>
                <div className="text-right">
                    <div className="glow-text text-base font-bold flex items-center gap-1.5 justify-end">
                        <MessageSquare size={14} className="opacity-70" />
                        {String(messageCount).padStart(2, "0")}
                    </div>
                    <div className="text-[9px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dim)" }}>MESSAGES</div>
                </div>
                <Activity size={16} className="hidden sm:block opacity-50" style={{ color: "var(--jarvis-gold)" }} />
            </div>
        </motion.header>
    );
}
