"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function StadiumBackground({ children }) {
  const [uiState, setUiState] = useState({
    isMobile: false,
    rotateEnabled: true,
    isNight: false,
    brightness: 1,
    fog: 0.08,
    ledSpeed: 6,
    settingsOpen: false,
  });

  // Detect mobile screen and night mode
  useEffect(() => {
    const check = () => {
      const hour = new Date().getHours();
      const isNight = hour >= 18 || hour < 6;
      
      setUiState((p) => ({
        ...p,
        isMobile: window.innerWidth < 820,
        isNight,
      }));
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Styles dérivés
  const backgroundGradient = uiState.isNight
    ? "linear-gradient(180deg,#06131a 0%, #071421 50%, #07131a 100%)"
    : "linear-gradient(180deg,#1b7a40 0%, #117a45 55%, #0f6b38 100%)";

  const stripeA = uiState.isNight ? "rgba(15, 50, 25, 0.85)" : "rgba(35,120,40,0.75)";
  const stripeB = uiState.isNight ? "rgba(12, 40, 20, 0.85)" : "rgba(30,105,35,0.75)";

  // Animation LED
  const ledAnimName = `ledAnim${uiState.ledSpeed}`;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        minHeight: "100vh",
        overflow: "hidden",
        background: backgroundGradient,
        filter: `brightness(${uiState.brightness})`,
      }}
    >
      {/* CSS Animations */}
      <style>{`
        @keyframes ${ledAnimName} {
          0% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
          100% { background-position: 0% 50% }
        }
        @keyframes netSwing {
          0% { transform: translateY(0) }
          50% { transform: translateY(-4px) }
          100% { transform: translateY(0) }
        }
        @keyframes fogMove {
          0% { transform: translateX(-10%) }
          50% { transform: translateX(10%) }
          100% { transform: translateX(-10%) }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); opacity: 1 }
          50% { transform: translateY(-12px) translateX(6px); opacity: 0.6 }
          100% { transform: translateY(0) translateX(0); opacity: 1 }
        }

        .stadium-particle {
          animation: particleFloat ${6 + Math.random() * 6}s ease-in-out infinite;
        }
      `}</style>

      {/* Grass texture overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/grass-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: uiState.isNight ? "overlay" : "soft-light",
          opacity: uiState.isNight ? 0.6 : 0.8,
          zIndex: 1,
        }}
      />

      {/* Stadium top shadows */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "15%",
          zIndex: 2,
          background: "linear-gradient(180deg, rgba(0,0,0,0.7), rgba(0,0,0,0))",
          filter: "blur(25px)",
        }}
      />

      {/* LED Border */}
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "4%",
          right: "4%",
          bottom: "4%",
          borderRadius: 18,
          pointerEvents: "none",
          zIndex: 3,
          background: "linear-gradient(90deg, rgba(180,220,255,0.9), rgba(120,180,255,0.95), rgba(180,220,255,0.9))",
          backgroundSize: "200% 200%",
          filter: "blur(8px) contrast(1.1)",
          animation: `${ledAnimName} ${uiState.ledSpeed}s linear infinite`,
          opacity: 0.4,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      />

      {/* Fog effect */}
      <div
        style={{
          position: "absolute",
          left: "-10%",
          top: "8%",
          width: "120%",
          height: "25%",
          zIndex: 4,
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "radial-gradient(closest-side, rgba(255,255,255,0.08), rgba(255,255,255,0))",
            filter: "blur(25px)",
            animation: "fogMove 18s linear infinite",
            opacity: uiState.fog,
          }}
        />
      </div>

      {/* FIELD WRAPPER — all field elements rotate together */}
      <div
        className="field-wrapper"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: uiState.isMobile
            ? "translate(-50%, -50%) rotate(90deg)"
            : "translate(-50%, -50%)",
          width: uiState.isMobile ? "180vw" : "85vw",
          height: uiState.isMobile ? "95vw" : "45vw",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          borderRadius: 20,
          overflow: "visible",
          transition: "transform 0.45s ease",
          zIndex: 5,
          boxShadow: "0 20px 50px rgba(0,0,0,0.4)",
        }}
      >
        {/* STRIPES */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              backgroundColor: i % 2 === 0 ? stripeA : stripeB,
              boxShadow: "inset 0 0 40px rgba(0,0,0,0.3)",
              position: "relative",
            }}
          >
            {/* Subtle grass pattern overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `
                  linear-gradient(45deg, transparent 45%, rgba(255,255,255,0.02) 50%, transparent 55%),
                  linear-gradient(-45deg, transparent 45%, rgba(255,255,255,0.02) 50%, transparent 55%)
                `,
                backgroundSize: "30px 30px",
                opacity: 0.3,
              }}
            />
          </div>
        ))}

        {/* OVERLAY (ALL LINES INSIDE THE FIELD WRAPPER) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 6,
          }}
        >
          {/* CENTER LINE with glow */}
          <motion.div
            initial={{ opacity: 0.1 }}
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: 4,
              transform: "translateX(-50%)",
              background: "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(255,255,255,0.7))",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
          />

          {/* CENTER CIRCLE with glow */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: uiState.isMobile ? 160 : 220,
              height: uiState.isMobile ? 160 : 220,
              borderRadius: "50%",
              border: "2px solid rgba(255,255,255,0.95)",
              boxShadow: 
                "0 0 10px rgba(255,255,255,0.4), " +
                "inset 0 0 20px rgba(255,255,255,0.2)",
              background: "transparent",
            }}
          />

          {/* DESKTOP PENALTY BOXES */}
          {!uiState.isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 170,
                  height: 300,
                  border: "5px solid rgba(255,255,255,0.95)",
                  borderRadius: 10,
                  boxShadow: "0 0 15px rgba(255,255,255,0.2)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  right: 18,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 170,
                  height: 300,
                  border: "5px solid rgba(255,255,255,0.95)",
                  borderRadius: 10,
                  boxShadow: "0 0 15px rgba(255,255,255,0.2)",
                }}
              />
            </>
          )}

          {/* DESKTOP SIDE GOALS with nets */}
          {!uiState.isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 60,
                  height: 200,
                  border: "6px solid rgba(255,255,255,1)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)",
                  overflow: "hidden",
                }}
              >
                {/* Goal net */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    animation: "netSwing 4s ease-in-out infinite",
                  }}
                />
              </div>
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 60,
                  height: 200,
                  border: "6px solid rgba(255,255,255,1)",
                  background: "rgba(255,255,255,0.05)",
                  borderRadius: 8,
                  boxShadow: "0 12px 28px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.3)",
                  overflow: "hidden",
                }}
              >
                {/* Goal net */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
                    `,
                    backgroundSize: "20px 20px",
                    backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
                    animation: "netSwing 4s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                />
              </div>
            </>
          )}

          {/* MOBILE GOALS (SIDES) with nets */}
          {uiState.isMobile && (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 45,
                  height: 160,
                  border: "6px solid rgba(255,255,255,1)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.3)",
                  overflow: "hidden",
                }}
              >
                {/* Goal net */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
                    `,
                    backgroundSize: "15px 15px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    animation: "netSwing 4s ease-in-out infinite",
                  }}
                />
              </div>

              <div
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: 45,
                  height: 160,
                  border: "6px solid rgba(255,255,255,1)",
                  borderRadius: 8,
                  background: "rgba(255,255,255,0.05)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.3)",
                  overflow: "hidden",
                }}
              >
                {/* Goal net */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundImage: `
                      linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(-45deg, rgba(255,255,255,0.1) 25%, transparent 25%),
                      linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.1) 75%),
                      linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.1) 75%)
                    `,
                    backgroundSize: "15px 15px",
                    backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                    animation: "netSwing 4s ease-in-out infinite",
                    animationDelay: "0.5s",
                  }}
                />
              </div>
            </>
          )}

          {/* CORNER FLAGS (visual dots) */}
          <div style={{ position: "absolute", left: 15, top: 15, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", right: 15, top: 15, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", left: 15, bottom: 15, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }} />
          <div style={{ position: "absolute", right: 15, bottom: 15, width: 8, height: 8, borderRadius: "50%", background: "rgba(255,255,255,0.9)", boxShadow: "0 0 8px rgba(255,255,255,0.6)" }} />
        </div>
      </div>

      {/* Crowd particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="stadium-particle"
          style={{
            position: "absolute",
            left: `${5 + Math.random() * 90}%`,
            top: `${2 + Math.random() * 10}%`,
            width: `${2 + Math.random() * 4}px`,
            height: `${2 + Math.random() * 4}px`,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.8)",
            filter: "blur(0.5px)",
            zIndex: 7,
            opacity: uiState.isNight ? 0.15 : 0.08,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}
      
// CONTENU ENFANTS AVEC SCROLL INDÉPENDANT
<div 
  className="stadium-content-container"
  style={{
    position: "relative",
    zIndex: 10,
    height: "100vh", // ← CHANGÉ: hauteur fixe de la vue
    overflowY: "auto", // ← Scroll seulement ici
    WebkitOverflowScrolling: "touch", // ← Scroll fluide mobile
  }}
>
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    style={{
      position: "relative",
      minHeight: "100%", // ← Prend toute la hauteur disponible
      paddingTop: '100px', // Espace pour le Navbar
      paddingBottom: '40px', // Espace en bas
    }}
  >
    {children}
  </motion.div>
</div>


      {/* Settings Button */}
      <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 20 }}>
        <button
          onClick={() => setUiState(p => ({ ...p, settingsOpen: !p.settingsOpen }))}
          style={{
            width: 50,
            height: 50,
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, rgba(0,0,0,0.7), rgba(0,0,0,0.4))",
            color: "white",
            fontSize: 20,
            cursor: "pointer",
            backdropFilter: "blur(10px)",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
          }}
        >
          ⚙
        </button>

        {/* Settings Panel */}
        <AnimatePresence>
          {uiState.settingsOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              style={{
                position: "absolute",
                bottom: 60,
                right: 0,
                width: 280,
                padding: 16,
                background: "linear-gradient(135deg, rgba(10,15,20,0.9), rgba(5,10,15,0.8))",
                borderRadius: 12,
                backdropFilter: "blur(15px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
                color: "white",
              }}
            >
              <h4 style={{ margin: "0 0 12px 0", fontSize: 16 }}>Stadium Settings</h4>
              
              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Brightness: {uiState.brightness.toFixed(1)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={uiState.brightness}
                  onChange={(e) => setUiState(p => ({ ...p, brightness: parseFloat(e.target.value) }))}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ marginBottom: 12 }}>
                <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  Fog: {uiState.fog.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.2"
                  step="0.01"
                  value={uiState.fog}
                  onChange={(e) => setUiState(p => ({ ...p, fog: parseFloat(e.target.value) }))}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, display: "block", marginBottom: 4 }}>
                  LED Speed: {uiState.ledSpeed}s
                </label>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="1"
                  value={uiState.ledSpeed}
                  onChange={(e) => setUiState(p => ({ ...p, ledSpeed: parseInt(e.target.value) }))}
                  style={{ width: "100%" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}


