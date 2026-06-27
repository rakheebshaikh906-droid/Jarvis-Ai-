import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

export default function RichResponseCard({ data }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="max-w-[430px] rounded-xl overflow-hidden"
            style={{
                background: "#110e06",
                border: "1px solid #4a3414",
                boxShadow: "0 0 18px rgba(240,184,64,0.12)"
            }}
        >
            {data.image && (
                <div
                    className="w-full h-64 flex items-center justify-center"
                    style={{ background: "#0b0905" }}
                >
                    <img
                        src={data.image}
                        alt={data.title}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            )}

            <div className="p-4">

                <h2
                    className="text-xl font-bold mb-3"
                    style={{ color: "#f5cc70" }}
                >
                    {data.title}
                </h2>

                <p
                    className="text-sm leading-7"
                    style={{ color: "#dfd5b7" }}
                >
                    {
                        data.summary.length > 250
                            ? data.summary.slice(0, 250) + "..."
                            : data.summary
                    }
                    <a
                        href={data.website}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm mt-3 inline-block"
                        style={{ color: "#f5cc70" }}
                    >
                        Read More →
                    </a>
                </p>

                <div className="mt-5 flex gap-3 flex-wrap">

                    {data.website && (
                        <a
                            href={data.website}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105"
                            style={{
                                background: "#2b1d09",
                                color: "#f5cc70",
                                border: "1px solid #6d4b18",
                            }}
                        >
                            <ExternalLink size={16} />
                            Wikipedia
                        </a>
                    )}

                </div>
            </div>
        </motion.div>
    );
}