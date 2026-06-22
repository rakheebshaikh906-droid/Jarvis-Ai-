import { motion } from "framer-motion";
import { Droplets, Wind, Thermometer, Sun, Eye, CloudSun } from "lucide-react";

export default function WeatherCard({ data, city }) {
    if (!data || !data.current) return null;
    const { current, location } = data;

    const stats = [
        { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
        { icon: Wind, label: "Wind", value: `${current.wind_kph} km/h` },
        { icon: Thermometer, label: "Feels Like", value: `${current.feelslike_c}°C` },
        { icon: Sun, label: "UV Index", value: current.uv },
        { icon: Eye, label: "Visibility", value: `${current.vis_km} km` },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="glass-panel glow-border !rounded-xl p-4 my-1 max-w-[92%]"
        >
            <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dim)" }}>JARVIS</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex items-center gap-3 sm:w-[46%]">
                    {current.condition?.icon ? (
                        <img
                            src={current.condition.icon.startsWith("http") ? current.condition.icon : `https:${current.condition.icon}`}
                            alt={current.condition.text}
                            className="w-14 h-14 drop-shadow-[0_0_8px_rgba(240,184,64,0.4)]"
                        />
                    ) : (
                        <CloudSun size={42} style={{ color: "var(--jarvis-gold)" }} />
                    )}
                    <div>
                        <div className="text-base font-bold tracking-wide" style={{ color: "#f5f0e0" }}>
                            {(location?.name || city || "").toUpperCase()}
                        </div>
                        <div className="text-[10px]" style={{ color: "var(--jarvis-gold-dim)" }}>
                            {[location?.region, location?.country].filter(Boolean).join(", ")}
                        </div>
                        <div className="glow-text text-2xl font-bold mt-1">{current.temp_c}°C</div>
                        <div className="text-[11px]" style={{ color: "#cdb985" }}>{current.condition?.text}</div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2 flex-1">
                    {stats.map((s) => (
                        <div
                            key={s.label}
                            className="flex items-center justify-between px-2.5 py-1.5 rounded-md border"
                            style={{ borderColor: "var(--jarvis-gold-dimmer)", background: "rgba(240,184,64,0.03)" }}
                        >
                            <span className="flex items-center gap-1.5 text-[10.5px]" style={{ color: "#cdb985" }}>
                                <s.icon size={12} style={{ color: "var(--jarvis-gold)" }} />
                                {s.label}
                            </span>
                            <span className="text-[11px] font-semibold" style={{ color: "#f5f0e0" }}>{s.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {current.last_updated && (
                <div className="text-[9.5px] mt-3 pt-2 border-t" style={{ color: "var(--jarvis-gold-dimmer)", borderColor: "var(--jarvis-gold-dimmer)" }}>
                    Last Updated: {current.last_updated}
                </div>
            )}
        </motion.div>
    );
}
