import { useMemo } from "react";

// Lightweight CSS-driven particle field. Purely decorative, no canvas needed.
export default function ParticlesBackground({ count = 22 }) {
    const particles = useMemo(() => {
        return Array.from({ length: count }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            size: 1.5 + Math.random() * 2.5,
            duration: 10 + Math.random() * 14,
            delay: Math.random() * 12,
        }));
    }, [count]);

    return (
        <>
            <div className="jarvis-grid-bg" />
            <div className="jarvis-vignette" />
            <div className="jarvis-particles">
                {particles.map((p) => (
                    <span
                        key={p.id}
                        className="jarvis-particle"
                        style={{
                            left: `${p.left}%`,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            animationDuration: `${p.duration}s`,
                            animationDelay: `${p.delay}s`,
                        }}
                    />
                ))}
            </div>
        </>
    );
}
