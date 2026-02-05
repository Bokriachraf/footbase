'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';

export default function KickoraLogo({ width = 850 }) {
  const controls = useAnimation();

  useEffect(() => {
    const sequence = async () => {
      // 1. Premier k (joueur) seulement
      await controls.start('firstKVisible');
      
      // 2. i apparaît avec le point EXACTEMENT à l'extrémité de la jambe
      await controls.start('iVisible');
      
      // 3. La jambe frappe le point (contact direct)
      await controls.start('kickAnimation');
      
      // 4. Ballon part IMMÉDIATEMENT après la frappe
      await controls.start('balloonFlight');
      
      // 5. i remonte pour s'aligner (en parallèle du vol du ballon)
      await controls.start('iAlign');
      
      // 6. c apparaît
      await controls.start('cVisible');
      
      // 7. Deuxième k apparaît
      await controls.start('secondKVisible');
      
      // 8. Contrôle du ballon par le deuxième k (contact direct)
      await controls.start('ballControl');
      
      // 9. Ballon atterrit et devient o
      await controls.start('balloonLanding');
      
      // 10. r apparaît
      await controls.start('rVisible');
      
      // 11. a apparaît
      await controls.start('aVisible');
    };

    sequence();
  }, [controls]);

  return (
    <motion.svg
      width={width}
      viewBox="0 0 850 200"
      xmlns="http://www.w3.org/2000/svg"
      style={{ overflow: 'visible' }}
    >
      {/* ================= k JOUEUR (première lettre) ================= */}
      {/* colonne vertébrale */}
      <motion.line
        x1="60" y1="40"
        x2="60" y2="140"
        stroke="#16C784"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          firstKVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.6 }}
      />

      {/* bras */}
      <motion.line
        x1="60" y1="80"
        x2="120" y2="50"
        stroke="#16C784"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          firstKVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.3, duration: 0.5 }}
      />

      {/* jambe - position initiale */}
      <motion.line
        x1="60" y1="110"
        x2="130" y2="160"
        stroke="#16C784"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0, rotate: 0 },
          firstKVisible: { pathLength: 1, opacity: 1, rotate: 0 },
          kickAnimation: { 
            rotate: [0, -60, -45],
            transition: {
              duration: 0.6,
              times: [0, 0.4, 1],
              ease: "easeInOut"
            }
          }
        }}
        initial="hidden"
        animate={controls}
        style={{ transformOrigin: '60px 110px' }}
      />

      {/* ================= i ================= */}
      {/* tige du i - POSITION BASSE INITIALEMENT */}
      <motion.g
        variants={{
          hidden: { opacity: 0 },
          iVisible: { opacity: 1, y: 40 },
          iAlign: { 
            y: 0,
            transition: { 
              duration: 0.4,
              delay: 0.2 // Commence pendant le vol du ballon
            }
          }
        }}
        initial="hidden"
        animate={controls}
        style={{ transformOrigin: '180px 85px' }}
      >
        <motion.path
          d="M180 85 Q180 145, 180 145"
          fill="none"
          stroke="currentColor"
          strokeWidth="14"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: 0 },
            iVisible: { pathLength: 1 }
          }}
          initial="hidden"
          animate={controls}
          transition={{ duration: 0.5 }}
        />
      </motion.g>

      {/* ================= BALLON (point du i) ================= */}
      {/* Position initiale : EXACTEMENT à l'extrémité de la jambe du k */}
      <motion.circle
        r="12"
        fill="#FF6B6B"
        stroke="currentColor"
        strokeWidth="2"
        variants={{
          hidden: { 
            opacity: 0,
            scale: 0,
            cx: 130, // MÊME X que l'extrémité de la jambe
            cy: 160  // MÊME Y que l'extrémité de la jambe
          },
          iVisible: { 
            opacity: 1, 
            scale: 1,
            cx: 130,
            cy: 160
          },
          kickAnimation: {
            scale: [1, 1.8, 1.5],
            fill: ["#FF6B6B", "#FFD166", "#FF6B6B"],
            transition: { 
              duration: 0.3,
              times: [0, 0.2, 1]
            }
          },
          // DÉPART IMMÉDIAT après la frappe
          balloonFlight: {
            scale: [1.5, 2, 1.8],
            cx: [130, 180, 280, 350, 420],
            cy: [160, 120, 60, 20, 40],
            transition: {
              duration: 1.2,
              ease: [0.17, 0.67, 0.83, 0.67],
              times: [0, 0.2, 0.5, 0.8, 1]
            }
          },
          // i remonte pendant que le ballon vole
          iAlign: {
            cx: [130, 180],
            cy: [160, 45],
            transition: {
              duration: 0.4,
              delay: 0.2
            }
          }
        }}
        initial="hidden"
        animate={controls}
      />

      {/* ================= c ================= */}
      <motion.path
        d="M280 60 C230 60, 230 140, 280 140"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          cVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.8 }}
      />

      {/* ================= k (deuxième lettre) ================= */}
      {/* colonne */}
      <motion.line
        x1="380" y1="60"
        x2="380" y2="140"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          secondKVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.4 }}
      />
      
      {/* bras supérieur */}
      <motion.line
        x1="380" y1="90"
        x2="440" y2="60"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          secondKVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.2, duration: 0.4 }}
      />
      
      {/* jambe (position initiale) */}
      <motion.line
        x1="380" y1="105"
        x2="445" y2="155"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0, rotate: 0 },
          secondKVisible: { 
            pathLength: 1, 
            opacity: 1, 
            rotate: 0 
          },
          ballControl: {
            rotate: [0, -40, -25],
            x: [0, -15, -8],
            transition: {
              duration: 0.5,
              times: [0, 0.3, 1],
              ease: "easeInOut"
            }
          }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.4, duration: 0.4 }}
        style={{ transformOrigin: '380px 105px' }}
      />

      {/* ================= SUITE DU PARCOURS DU BALLON ================= */}
      {/* Animation après le vol initial */}
      <motion.circle
        r="12"
        fill="#FF6B6B"
        stroke="currentColor"
        strokeWidth="2"
        variants={{
          hidden: { opacity: 0 },
          // Continuité de l'animation après balloonFlight
          ballControl: {
            opacity: 1,
            scale: [1.8, 1.5, 1.6],
            cx: [420, 400, 450, 480],
            cy: [40, 80, 60, 90],
            transition: {
              duration: 0.8,
              ease: "easeInOut",
              times: [0, 0.4, 0.7, 1]
            }
          },
          // CONTACT avec la jambe du deuxième k
          balloonLanding: {
            scale: [1.6, 1, 1.3, 1],
            r: [12, 32, 32],
            cx: [480, 520, 520, 560],
            cy: [90, 130, 110, 100],
            transition: {
              duration: 0.9,
              times: [0, 0.3, 0.6, 1],
              ease: "easeOut"
            }
          }
        }}
        initial="hidden"
        animate={controls}
      />

      {/* ================= o (apparaît après atterrissage) ================= */}
      <motion.circle
        cx="560"
        cy="100"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0, scale: 0 },
          balloonLanding: { 
            pathLength: 1, 
            opacity: 1,
            scale: 1,
            transition: { 
              delay: 0.2,
              duration: 0.5 
            }
          }
        }}
        initial="hidden"
        animate={controls}
      />

      {/* ================= r (minuscule) ================= */}
      {/* tige verticale */}
      <motion.path
        d="M640 70 Q640 120, 640 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          rVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.4 }}
      />

      {/* courbe du r */}
      <motion.path
        d="M640 70 Q680 70, 660 95"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          rVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.2, duration: 0.5 }}
      />

      {/* petite queue du r */}
      <motion.path
        d="M660 95 Q675 110, 690 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          rVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.4, duration: 0.4 }}
      />

      {/* ================= a (minuscule) ================= */}
      {/* boucle du a */}
      <motion.path
        d="M760 100 Q730 100, 730 130 Q730 160, 760 160 Q790 160, 790 130 Q790 100, 760 100"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          aVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ duration: 0.8 }}
      />

      {/* tige verticale du a */}
      <motion.path
        d="M790 130 Q790 160, 790 160"
        fill="none"
        stroke="currentColor"
        strokeWidth="14"
        strokeLinecap="round"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          aVisible: { pathLength: 1, opacity: 1 }
        }}
        initial="hidden"
        animate={controls}
        transition={{ delay: 0.4, duration: 0.4 }}
      />
    </motion.svg>
  );
}



// 'use client';

// import { motion, useAnimation } from 'framer-motion';
// import { useEffect } from 'react';

// export default function KickoraLogo({ width = 800 }) {
//   const controls = useAnimation();

//   useEffect(() => {
//     const sequence = async () => {
//       // 1. Premier k (joueur) seulement
//       await controls.start('firstKVisible');
      
//       // 2. i apparaît PLUS BAS pour que le point soit aligné avec la jambe
//       await controls.start('iVisible');
      
//       // 3. La jambe frappe le point
//       await controls.start('kickAnimation');
      
//       // 4. i remonte pour s'aligner avec les autres lettres
//       await controls.start('iAlign');
      
//       // 5. c apparaît
//       await controls.start('cVisible');
      
//       // 6. Deuxième k apparaît
//       await controls.start('secondKVisible');
      
//       // 7. Ballon fait trajectoire parabolique
//       await controls.start('balloonFlight');
      
//       // 8. Deuxième k contrôle le ballon
//       await controls.start('ballControl');
      
//       // 9. Ballon atterrit et devient o
//       await controls.start('balloonLanding');
      
//       // 10. r apparaît
//       await controls.start('rVisible');
      
//       // 11. a apparaît
//       await controls.start('aVisible');
//     };

//     sequence();
//   }, [controls]);

//   return (
//     <motion.svg
//       width={width}
//       viewBox="0 0 850 200"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ overflow: 'visible' }}
//     >
//       {/* ================= k JOUEUR (première lettre) ================= */}
//       {/* colonne vertébrale */}
//       <motion.line
//         x1="60" y1="40"
//         x2="60" y2="140"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           firstKVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.6 }}
//       />

//       {/* bras */}
//       <motion.line
//         x1="60" y1="80"
//         x2="120" y2="50"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           firstKVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.3, duration: 0.5 }}
//       />

//       {/* jambe - position initiale */}
//       <motion.line
//         x1="60" y1="110"
//         x2="130" y2="160"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0, rotate: 0 },
//           firstKVisible: { pathLength: 1, rotate: 0 },
//           kickAnimation: { 
//             rotate: [-10, -60, -50],
//             transition: {
//               duration: 0.8,
//               times: [0, 0.3, 1],
//               ease: "easeInOut"
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         style={{ transformOrigin: '60px 110px' }}
//       />

//       {/* ================= i ================= */}
//       {/* tige du i - POSITION BASSE INITIALEMENT */}
//       <motion.g
//         variants={{
//           hidden: { opacity: 0, y: 0 },
//           iVisible: { opacity: 1, y: 40 },
//           iAlign: { y: 0 }
//         }}
//         initial="hidden"
//         animate={controls}
//       >
//         <motion.path
//           d="M180 85 Q180 145, 180 145"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="14"
//           strokeLinecap="round"
//           variants={{
//             hidden: { pathLength: 0 },
//             iVisible: { pathLength: 1 }
//           }}
//           transition={{ duration: 0.5 }}
//         />
//       </motion.g>

//       {/* point du i (ballon) - POSITION BASSE POUR ÊTRE FRAPPÉ */}
//       <motion.circle
//         r="12"
//         fill="#FF6B6B"
//         stroke="currentColor"
//         strokeWidth="2"
//         variants={{
//           hidden: { opacity: 0, scale: 0, cx: 180, cy: 65 },
//           iVisible: { opacity: 1, scale: 1, cx: 180, cy: 65 },
//           kickAnimation: { 
//             scale: [1, 1.5, 1.3],
//             fill: ["#FF6B6B", "#FFD166", "#FF6B6B"],
//             transition: { 
//               duration: 0.4,
//               times: [0, 0.3, 1]
//             }
//           },
//           iAlign: {
//             cy: 45,
//             transition: { duration: 0.4 }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//       />

//       {/* ================= c ================= */}
//       {/* Le c n'apparaît qu'APRÈS que le i soit aligné */}
//       <motion.path
//         d="M280 60 C230 60, 230 140, 280 140"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0, opacity: 0 },
//           cVisible: { pathLength: 1, opacity: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.8, delay: 0.2 }}
//       />

//       {/* ================= k (deuxième lettre) ================= */}
//       {/* colonne */}
//       <motion.line
//         x1="380" y1="60"
//         x2="380" y2="140"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.4 }}
//       />
      
//       {/* bras supérieur */}
//       <motion.line
//         x1="380" y1="90"
//         x2="440" y2="60"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.2, duration: 0.4 }}
//       />
      
//       {/* jambe (position initiale) */}
//       <motion.line
//         x1="380" y1="105"
//         x2="445" y2="155"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 },
//           ballControl: {
//             rotate: [0, -25, -15],
//             x: [0, -10, -5],
//             transition: {
//               duration: 0.6,
//               times: [0, 0.4, 1],
//               ease: "easeInOut"
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//         style={{ transformOrigin: '380px 105px' }}
//       />

//       {/* ================= BALLON (parcours complet) ================= */}
//       {/* Ballon principal */}
//       <motion.circle
//         r="12"
//         fill="#FF6B6B"
//         stroke="currentColor"
//         strokeWidth="2"
//         variants={{
//           hidden: { 
//             opacity: 0,
//             scale: 1,
//             cx: 180,
//             cy: 65
//           },
//           kickAnimation: {
//             opacity: 1,
//             scale: 1.3,
//             cx: 180,
//             cy: 65
//           },
//           iAlign: {
//             cy: 45
//           },
//           balloonFlight: {
//             scale: [1.3, 1.8, 1.5],
//             cx: [180, 280, 350, 420],
//             cy: [45, 10, -15, 30],
//             transition: {
//               duration: 1.5,
//               ease: [0.17, 0.67, 0.83, 0.67],
//               times: [0, 0.4, 0.7, 1]
//             }
//           },
//           ballControl: {
//             cx: [420, 390, 410, 480],
//             cy: [30, 60, 45, 85],
//             scale: [1.5, 1.3, 1.4, 1.5],
//             transition: {
//               duration: 0.8,
//               ease: "easeInOut",
//               times: [0, 0.3, 0.6, 1]
//             }
//           },
//           balloonLanding: {
//             scale: [1.5, 1, 1.2, 1],
//             r: [12, 30, 30],
//             cx: 560,
//             cy: 100,
//             transition: {
//               duration: 0.8,
//               times: [0, 0.3, 0.6, 1],
//               ease: "easeOut"
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//       />

//       {/* ================= o (apparaît après atterrissage) ================= */}
//       <motion.circle
//         cx="560"
//         cy="100"
//         r="30"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0, opacity: 0 },
//           balloonLanding: { 
//             pathLength: 1, 
//             opacity: 1,
//             transition: { 
//               delay: 0.4,
//               duration: 0.6 
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//       />

//       {/* ================= r (minuscule) ================= */}
//       {/* tige verticale */}
//       <motion.path
//         d="M640 70 Q640 120, 640 120"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.4 }}
//       />

//       {/* courbe du r */}
//       <motion.path
//         d="M640 70 Q680 70, 660 95"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.2, duration: 0.5 }}
//       />

//       {/* petite queue du r */}
//       <motion.path
//         d="M660 95 Q675 110, 690 120"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//       />

//       {/* ================= a (minuscule) ================= */}
//       {/* boucle du a */}
//       <motion.path
//         d="M760 100 Q730 100, 730 130 Q730 160, 760 160 Q790 160, 790 130 Q790 100, 760 100"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           aVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.8 }}
//       />

//       {/* tige verticale du a */}
//       <motion.path
//         d="M790 130 Q790 160, 790 160"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           aVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//       />

//       {/* ================= LIGNE DE BASE POUR ALIGNEMENT ================= */}
//       <motion.line
//         x1="40" y1="160" x2="820" y2="160"
//         stroke="rgba(0,0,0,0.15)"
//         strokeWidth="3"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.5 }}
//       />

//       {/* ================= LIGNES VERTICALES D'ALIGNEMENT ================= */}
//       {/* Lignes de repère pour chaque lettre (visibles en développement) */}
//       <motion.line
//         x1="60" y1="40" x2="60" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.6 }}
//       />
      
//       <motion.line
//         x1="180" y1="45" x2="180" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.7 }}
//       />
      
//       <motion.line
//         x1="280" y1="60" x2="280" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.8 }}
//       />
      
//       <motion.line
//         x1="380" y1="60" x2="380" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.9 }}
//       />
      
//       <motion.line
//         x1="560" y1="100" x2="560" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 1.0 }}
//       />
      
//       <motion.line
//         x1="640" y1="70" x2="640" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 1.1 }}
//       />
      
//       <motion.line
//         x1="760" y1="100" x2="760" y2="160"
//         stroke="rgba(0,0,255,0.1)"
//         strokeWidth="1"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 0.3 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 1.2 }}
//       />
//     </motion.svg>
//   );
// }


// 'use client';

// import { motion, useAnimation } from 'framer-motion';
// import { useEffect } from 'react';

// export default function KickoraLogo({ width = 720 }) {
//   const controls = useAnimation();

//   useEffect(() => {
//     const sequence = async () => {
//       // 1. Affichage du K (joueur)
//       await controls.start('kVisible');
      
//       // 2. Affichage du i
//       await controls.start('iVisible');
      
//       // 3. Affichage du c
//       await controls.start('cVisible');
      
//       // 4. Affichage du deuxième k
//       await controls.start('secondKVisible');
      
//       // 5. Animation de frappe + trajectoire parabolique du ballon
//       await controls.start('kickAnimation');
      
//       // 6. Contrôle de balle par le deuxième k
//       await controls.start('ballControl');
      
//       // 7. Atterrissage du ballon et transformation en o
//       await controls.start('balloonLanding');
      
//       // 8. Affichage du r
//       await controls.start('rVisible');
      
//       // 9. Affichage du a
//       await controls.start('aVisible');
//     };

//     sequence();
//   }, [controls]);

//   return (
//     <motion.svg
//       width={width}
//       viewBox="0 0 800 180"
//       xmlns="http://www.w3.org/2000/svg"
//       style={{ overflow: 'visible' }}
//     >
//       {/* ================= k JOUEUR (première lettre) ================= */}
//       {/* colonne vertébrale */}
//       <motion.line
//         x1="40" y1="40"
//         x2="40" y2="120"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           kVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.6 }}
//       />

//       {/* bras */}
//       <motion.line
//         x1="40" y1="65"
//         x2="95" y2="40"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           kVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.2, duration: 0.4 }}
//       />

//       {/* jambe - position initiale */}
//       <motion.line
//         x1="40" y1="90"
//         x2="100" y2="130"
//         stroke="#16C784"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { rotate: 0, x: 0, y: 0 },
//           kickAnimation: { 
//             rotate: [-5, -45, -35],
//             transition: {
//               duration: 0.6,
//               times: [0, 0.2, 1],
//               ease: "easeInOut"
//             }
//           },
//           ballControl: {
//             rotate: -35,
//             transition: { duration: 0.2 }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         style={{ transformOrigin: '40px 90px' }}
//       />

//       {/* ================= i ================= */}
//       {/* tige du i */}
//       <motion.path
//         d="M140 45 Q140 110, 140 110"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           iVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.6, duration: 0.5 }}
//       />

//       {/* point du i (ballon avant frappe) */}
//       <motion.circle
//         r="12"
//         fill="#FF6B6B"
//         stroke="currentColor"
//         strokeWidth="2"
//         variants={{
//           hidden: { opacity: 0, scale: 0 },
//           iVisible: { opacity: 1, scale: 1 },
//           kickAnimation: { 
//             scale: [1, 1.3, 1],
//             fill: ["#FF6B6B", "#FFD166", "#FF6B6B"],
//             transition: { 
//               duration: 0.4,
//               times: [0, 0.5, 1]
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         style={{ cx: 140, cy: 25 }}
//       />

//       {/* ================= c ================= */}
//       <motion.path
//         d="M230 45 C180 45, 180 115, 230 115"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           cVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.8 }}
//       />

//       {/* ================= k (deuxième lettre) ================= */}
//       {/* colonne */}
//       <motion.line
//         x1="320" y1="40"
//         x2="320" y2="120"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 },
//           ballControl: {
//             x: [0, 10, 5],
//             y: [0, -5, 0],
//             transition: {
//               duration: 0.5,
//               times: [0, 0.3, 1]
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.4 }}
//       />
      
//       {/* bras supérieur */}
//       <motion.line
//         x1="320" y1="70"
//         x2="375" y2="45"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 },
//           ballControl: {
//             rotate: [0, 15, 10],
//             transition: {
//               duration: 0.5,
//               times: [0, 0.3, 1]
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.2, duration: 0.4 }}
//         style={{ transformOrigin: '320px 70px' }}
//       />
      
//       {/* jambe (qui contrôle la balle) */}
//       <motion.line
//         x1="320" y1="85"
//         x2="380" y2="130"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           secondKVisible: { pathLength: 1 },
//           ballControl: {
//             rotate: [0, -20, -10],
//             x: [0, -8, -4],
//             transition: {
//               duration: 0.8,
//               times: [0, 0.4, 1],
//               ease: "easeInOut"
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//         style={{ transformOrigin: '320px 85px' }}
//       />

//       {/* ================= BALLON (qui remplace le o) ================= */}
//       {/* Ballon principal */}
//       <motion.circle
//         r="12"
//         fill="#FF6B6B"
//         stroke="currentColor"
//         strokeWidth="2"
//         variants={{
//           hidden: { 
//             opacity: 0,
//             scale: 1,
//             cx: 140,
//             cy: 25
//           },
//           kickAnimation: {
//             opacity: 1,
//             scale: [1, 1.5, 1.3],
//             cx: [140, 210, 280, 340, 380],
//             cy: [25, -5, -20, 0, 40],
//             transition: {
//               duration: 1.2,
//               ease: [0.17, 0.67, 0.83, 0.67],
//               times: [0, 0.3, 0.5, 0.7, 1]
//             }
//           },
//           ballControl: {
//             cx: [380, 350, 370, 450],
//             cy: [40, 60, 50, 80],
//             scale: [1.3, 1.2, 1.25, 1.3],
//             transition: {
//               duration: 0.8,
//               ease: "easeInOut",
//               times: [0, 0.4, 0.7, 1]
//             }
//           },
//           balloonLanding: {
//             scale: [1.3, 0.9, 1.1, 1],
//             r: [12, 28, 28],
//             cx: 520,
//             cy: 80,
//             transition: {
//               duration: 0.8,
//               times: [0, 0.4, 0.7, 1]
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//       />

//       {/* Effet d'ombre/rebond du ballon */}
//       <motion.ellipse
//         rx="15"
//         ry="5"
//         fill="rgba(0,0,0,0.1)"
//         variants={{
//           hidden: { opacity: 0, scale: 0 },
//           balloonLanding: {
//             opacity: [0, 0.5, 0],
//             scale: [0.8, 1.2, 0.8],
//             transition: {
//               duration: 0.8,
//               times: [0, 0.3, 1]
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//         style={{ cx: 520, cy: 110 }}
//       />

//       {/* ================= o (cercle qui apparaît après atterrissage) ================= */}
//       <motion.circle
//         cx="520"
//         cy="80"
//         r="28"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0, opacity: 0 },
//           balloonLanding: { 
//             pathLength: 1, 
//             opacity: 1,
//             transition: { 
//               delay: 0.3,
//               duration: 0.6 
//             }
//           }
//         }}
//         initial="hidden"
//         animate={controls}
//       />

//       {/* ================= r (minuscule) ================= */}
//       {/* tige courte */}
//       <motion.path
//         d="M600 60 Q600 100, 600 100"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.4 }}
//       />

//       {/* courbe du r */}
//       <motion.path
//         d="M600 60 Q640 60, 620 85"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.2, duration: 0.5 }}
//       />

//       {/* petite queue du r */}
//       <motion.path
//         d="M620 85 Q635 100, 650 110"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           rVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//       />

//       {/* ================= a (minuscule) ================= */}
//       {/* boucle du a */}
//       <motion.path
//         d="M710 80 Q680 80, 680 110 Q680 140, 710 140 Q740 140, 740 110 Q740 80, 710 80"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           aVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ duration: 0.8 }}
//       />

//       {/* tige verticale du a */}
//       <motion.path
//         d="M740 110 Q740 140, 740 140"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="14"
//         strokeLinecap="round"
//         variants={{
//           hidden: { pathLength: 0 },
//           aVisible: { pathLength: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.4, duration: 0.4 }}
//       />

//       {/* ================= LIGNE DE BASE ================= */}
//       <motion.line
//         x1="20" y1="140" x2="760" y2="140"
//         stroke="rgba(0,0,0,0.1)"
//         strokeWidth="2"
//         strokeDasharray="5,5"
//         variants={{
//           hidden: { opacity: 0 },
//           aVisible: { opacity: 1 }
//         }}
//         initial="hidden"
//         animate={controls}
//         transition={{ delay: 0.5 }}
//       />
//     </motion.svg>
//   );
// }
