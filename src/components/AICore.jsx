import { motion } from "framer-motion";

export default function AICore() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="glass-panel glow-border p-3 flex flex-col shrink-0"
        >
            <div className="text-[11px] tracking-[2px] mb-2" style={{ color: "var(--jarvis-gold-dim)" }}>
                JARVIS AI CORE
            </div>

            <div className="relative flex items-center justify-center" style={{ height: "110px" }}>
                <svg viewBox="0 0 160 160" className="w-full max-w-[110px]">
                    <defs>
                        <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#ffe9b0" stopOpacity="1" />
                            <stop offset="55%" stopColor="#f0b840" stopOpacity="0.85" />
                            <stop offset="100%" stopColor="#f0b840" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    <g className="ai-ring" style={{ transformOrigin: "80px 80px", animationDuration: "14s" }}>
                        <ellipse cx="80" cy="80" rx="70" ry="26" fill="none" stroke="#7a5820" strokeWidth="1" opacity="0.6" />
                    </g>
                    <g className="ai-ring-rev" style={{ transformOrigin: "80px 80px", animationDuration: "10s" }}>
                        <ellipse cx="80" cy="80" rx="50" ry="62" fill="none" stroke="#7a5820" strokeWidth="1" opacity="0.5" />
                    </g>
                    <g className="ai-ring" style={{ transformOrigin: "80px 80px", animationDuration: "20s" }}>
                        <ellipse cx="80" cy="80" rx="62" ry="44" fill="none" stroke="#5a3e18" strokeWidth="1" opacity="0.45" />
                    </g>

                    <circle className="ai-core-pulse" cx="80" cy="80" r="26" fill="url(#coreGlow)" style={{ transformOrigin: "80px 80px" }} />
                    <circle cx="80" cy="80" r="9" fill="#fff3d6" />
                </svg>
            </div>

            <div className="flex items-center justify-center gap-2 mt-1">
                <span className="w-1.5 h-1.5 rounded-full glow-dot" style={{ background: "#3ddc6e", color: "#3ddc6e" }} />
                <span className="text-[10px] tracking-[2px]" style={{ color: "#7adf99" }}>AI CORE ACTIVE</span>
            </div>
        </motion.div>
    );
}