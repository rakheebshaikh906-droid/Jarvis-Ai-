export default function Footer() {
    return (
        <div className="flex items-center justify-between px-2 pt-3 mt-2 text-[10px] tracking-wide shrink-0">
            <span style={{ color: "var(--jarvis-gold-dim)" }}>
                BUILT <span style={{ color: "#e0544c" }}>❤</span> BY SHAIKH ABDUL RAKHEEB
            </span>

            <span
                className="px-3 py-1 rounded-md border"
                style={{ color: "var(--jarvis-gold)", borderColor: "var(--jarvis-gold-dimmer)" }}
            >
                VERSION 3.1.0
            </span>

            <span className="flex items-center gap-1.5" style={{ color: "var(--jarvis-gold-dim)" }}>
                ALL SYSTEMS OPERATIONAL
                <span className="w-1.5 h-1.5 rounded-full glow-dot" style={{ background: "#3ddc6e" }} />
            </span>
        </div>
    );
}