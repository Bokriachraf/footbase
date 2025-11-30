"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

export default function FootballFieldBackground({ children }) {
  const [nightMode, setNightMode] = useState(true);

  return (
    <div className="relative min-h-screen overflow-hidden select-none">

      {/* BACKGROUND COLOR */}
      <div
        className={`absolute inset-0 transition-colors duration-700 ${
          nightMode ? "bg-[rgb(6,38,20)]" : "bg-[rgb(22,95,36)]"
        }`}
      />

      {/* STRIPES */}
      <div className="absolute inset-0 pointer-events-none opacity-75">
        <div className="absolute inset-0 grid grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={
                i % 2 === 0
                  ? "bg-[rgba(0,0,0,0.06)]"
                  : "bg-[rgba(255,255,255,0.02)]"
              }
              style={{ mixBlendMode: "overlay" }}
            />
          ))}
        </div>

        {/* NOISE TEXTURE */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23f)' opacity='0.6' fill='%23000400'/></svg>\")",
            backgroundRepeat: "repeat",
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* FIELD LINES */}
      <div className="absolute inset-0 pointer-events-none">
        {/* center line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-[3px] bg-white/80 -translate-x-1/2" />
        {/* center circle */}
        <div className="absolute left-1/2 top-1/2 w-56 h-56 rounded-full border-4 border-white/80 -translate-x-1/2 -translate-y-1/2" />
        {/* penalty boxes */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-48 h-80 border-4 border-white/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-48 h-80 border-4 border-white/80" />
      </div>

      {/* NIGHT LIGHTS */}
      {nightMode && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.2 }}
            className="absolute top-6 left-10 w-64 h-64 bg-white blur-3xl rounded-full pointer-events-none"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.6 }}
            className="absolute top-6 right-10 w-64 h-64 bg-white blur-3xl rounded-full pointer-events-none"
          />
        </>
      )}

      {/* CONTENT (children) */}
      <div className="relative z-10 py-10 px-6">
        {/* Toggle Night/Day */}
        <div className="flex justify-end max-w-6xl mx-auto mb-4">
          <button
            onClick={() => setNightMode((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-black/30 backdrop-blur text-white hover:scale-105 transition"
          >
            {nightMode ? (
              <>
                <Sun className="w-4 h-4" /> Day
              </>
            ) : (
              <>
                <Moon className="w-4 h-4" /> Night
              </>
            )}
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
