import { motion, AnimatePresence } from "framer-motion";
import MessageBubble from "./MessageBubble";

export default function ChatPanel({ messages, loading, chatRef }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel glow-border flex-1 flex flex-col p-4 min-w-0"
        >
            <div className="text-[11px] mb-3 tracking-wide" style={{ color: "var(--jarvis-gold-dim)" }}>
                {"// "}
                <span style={{ color: "var(--jarvis-gold)" }}>rakheebShaikh@jarvis</span>
                {" ~ active session"}
            </div>

            <div
                ref={chatRef}
                className="jarvis-scroll relative flex-1 min-h-[320px] max-h-[420px] overflow-y-auto rounded-lg p-3.5 flex flex-col gap-3"
                style={{ background: "#050402", border: "0.5px solid var(--jarvis-gold-dimmer)" }}
            >
                <div className="scan-sweep" />
                <AnimatePresence initial={false}>
                    {messages.map((msg, i) => (
                        <MessageBubble key={msg.id ?? i} msg={msg} />
                    ))}
                </AnimatePresence>

                {loading && (
                    <div className="flex gap-1.5 px-1 py-2">
                        {[0, 1, 2].map((i) => (
                            <span
                                key={i}
                                className="typing-dot w-[5px] h-[5px] rounded-full inline-block"
                                style={{ background: "var(--jarvis-gold)" }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
