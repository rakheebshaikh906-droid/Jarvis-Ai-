import { motion } from "framer-motion";
import { Mic, Send, Download } from "lucide-react";

export default function InputBar({
    input,
    setInput,
    onSend,
    onMic,
    isListening,
    onDownload,
}) {
    return (
        <div className="mt-4">
            <div className="flex gap-2 mb-4">
                <motion.button
                    whileTap={{ scale: 0.92 }}
                    onClick={onMic}
                    title="Voice input"
                    className={`mic-btn shrink-0 w-11 rounded-md border flex items-center justify-center ${isListening ? "listening" : ""}`}
                    style={{ borderColor: "#5a3e18", color: "var(--jarvis-gold-dim)", background: "transparent" }}
                >
                    <Mic size={17} />
                </motion.button>

                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && input.trim()) {
                            onSend();
                        }
                    }}
                    placeholder="$ enter command..."
                    className="flex-1 min-w-0 rounded-md px-3.5 py-2.5 text-[13px] outline-none"
                    style={{
                        background: "#050402",
                        border: "0.5px solid #5a3e18",
                        color: "#f0e0b0",
                        fontFamily: "'Courier New', monospace",
                    }}
                />

                <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => input.trim() && onSend()}
                    className="btn-exec shrink-0 rounded-md px-4 sm:px-5 text-[10px] font-bold tracking-[2px] flex items-center gap-1.5"
                >
                    <Send size={13} />
                    <span className="hidden sm:inline">SEND</span>
                </motion.button>
            </div>

            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex gap-5">
                    <div className="text-[9px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dimmer)" }}>
                        build <span style={{ color: "var(--jarvis-gold-dim)" }}>v3.1.0</span>
                    </div>
                    <div className="text-[9px] tracking-[2px]" style={{ color: "var(--jarvis-gold-dimmer)" }}>
                        status <span style={{ color: "var(--jarvis-gold-dim)" }}>online</span>
                    </div>
                </div>
                <button
                    onClick={onDownload}
                    className="btn-ghost flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-md border tracking-wide"
                    style={{ borderColor: "var(--jarvis-gold-dimmer)", color: "var(--jarvis-gold-dim)", background: "transparent" }}
                >
                    <Download size={12} />
                    export log
                </button>
            </div>
        </div>
    );
}
