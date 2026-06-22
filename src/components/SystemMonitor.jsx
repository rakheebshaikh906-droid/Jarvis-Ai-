import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, MemoryStick, HardDrive, Wifi } from "lucide-react";

const R = 36;
const CIRC = 2 * Math.PI * R;

export default function SystemMonitor() {
    // Decorative, gently animated mock telemetry — real OS metrics aren't
    // exposed to the browser sandbox, so values drift subtly for a "live" feel.
    const [cpu, setCpu] = useState(42);
    const [net, setNet] = useState(34.2);

    useEffect(() => {
        const interval = setInterval(() => {
            setCpu((c) => {
                const next = c + (Math.random() * 6 - 3);
                return Math.min(78, Math.max(18, Math.round(next)));
            });
            setNet((n) => {
                const next = n + (Math.random() * 4 - 2);
                return Math.max(8, Math.min(60, +next.toFixed(1)));
            });
        }, 2200);
        return () => clearInterval(interval);
    }, []);

    const offset = CIRC - (cpu / 100) * CIRC;

    return (
        <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-panel glow-border p-4"
        >
            <div className="text-[11px] tracking-[2px] mb-3" style={{ color: "var(--jarvis-gold-dim)" }}>
                SYSTEM MONITOR
            </div>

            <div className="flex items-center gap-4">
                <div className="relative w-[88px] h-[88px] shrink-0">
                    <svg width="88" height="88" viewBox="0 0 88 88">
                        <circle cx="44" cy="44" r={R} fill="none" stroke="#241a08" strokeWidth="7" />
                        <circle
                            className="gauge-ring"
                            cx="44"
                            cy="44"
                            r={R}
                            fill="none"
                            stroke="var(--jarvis-gold)"
                            strokeWidth="7"
                            strokeLinecap="round"
                            strokeDasharray={CIRC}
                            strokeDashoffset={offset}
                            transform="rotate(-90 44 44)"
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="glow-text text-lg font-bold leading-none">{cpu}%</span>
                        <span className="text-[8px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dim)" }}>CPU</span>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                    <Stat icon={MemoryStick} label="RAM" value="5.1 GB / 16 GB" pct={32} />
                    <Stat icon={HardDrive} label="DISK" value="128 GB / 256 GB" pct={50} />
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "#cdb985" }}>
                            <Wifi size={12} style={{ color: "var(--jarvis-gold)" }} />
                            NETWORK
                        </span>
                        <span className="text-[10px] font-semibold" style={{ color: "#f5f0e0" }}>{net} Mbps</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

function Stat({ icon: Icon, label, value, pct }) {
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <span className="flex items-center gap-1.5 text-[10px]" style={{ color: "#cdb985" }}>
                    <Icon size={12} style={{ color: "var(--jarvis-gold)" }} />
                    {label}
                </span>
                <span className="text-[10px] font-semibold" style={{ color: "#f5f0e0" }}>{value}</span>
            </div>
            <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "#241a08" }}>
                <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, background: "var(--jarvis-gold)", boxShadow: "0 0 6px rgba(240,184,64,0.6)" }}
                />
            </div>
        </div>
    );
}
