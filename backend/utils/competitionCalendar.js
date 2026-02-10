import Match from "../models/matchModel.js";
import mongoose from "mongoose";


 export function getTourName(nbEquipes) {
  switch (nbEquipes) {
    case 2:
      return "FINALE";
    case 4:
      return "DEMI_FINALE";
    case 8:
      return "QUART_DE_FINALE";
    case 16:
      return "HUITIEME_DE_FINALE";
    case 32:
      return "SEIZIEME_DE_FINALE";
    default:
      return `TOUR_${nbEquipes}`;
  }
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}






export async function generateTournamentNoGroup(competition) {
  const equipes = shuffleArray(
    competition.equipesInscrites.map((e) => (e._id ? e._id : e))
  );

  const nbEquipes = equipes.length;

  if ((nbEquipes & (nbEquipes - 1)) !== 0) {
    throw new Error("Le nombre d'équipes doit être une puissance de 2");
  }

  if (!competition.terrains?.length) {
    throw new Error("Aucun terrain défini");
  }

  const terrain = competition.terrains[0];
  const proprietaire = competition.organisateur;

  competition.calendrier = [];

  /* =========================================================
     1️⃣ PREMIER TOUR (équipes connues)
  ========================================================= */
  let currentMatches = [];

  for (let i = 0; i < equipes.length; i += 2) {
    const equipeA = equipes[i];
    const equipeB = equipes[i + 1];

    const match = await Match.create({
      terrain,
      proprietaire,
      type: "COMPETITION",
      mode: "EQUIPE",
      competition: competition._id,

      // logique compétition
      equipeA,
      equipeB,

      // 🔥 SYNCHRO avec match libre
      equipes: [equipeA, equipeB],

      statut: "Ouvert",
    });

    currentMatches.push(match);
  }

  competition.calendrier.push({
    tour: getTourName(currentMatches.length * 2),
    matchs: currentMatches.map((m) => ({
      equipeA: m.equipeA,
      equipeB: m.equipeB,
      matchId: m._id,
      fromMatchA: null,
      fromMatchB: null,
    })),
  });

  /* =========================================================
     2️⃣ TOURS SUIVANTS (Demi / Finale)
     ➜ matchs créés VIDES mais prêts à être remplis
  ========================================================= */
  while (currentMatches.length > 1) {
    currentMatches = shuffleArray(currentMatches);

    const nextMatches = [];
    const calendrierMatchs = [];

    for (let i = 0; i < currentMatches.length; i += 2) {
      const match = await Match.create({
        terrain,
        proprietaire,
        type: "COMPETITION",
        mode: "EQUIPE",
        competition: competition._id,

        // équipes inconnues au départ
        equipeA: null,
        equipeB: null,
        equipes: [],

        statut: "Ouvert",
      });

      calendrierMatchs.push({
        equipeA: null,
        equipeB: null,
        matchId: match._id,
        fromMatchA: currentMatches[i]._id,
        fromMatchB: currentMatches[i + 1]._id,
      });

      nextMatches.push(match);
    }

    competition.calendrier.push({
      tour: getTourName(currentMatches.length),
      matchs: calendrierMatchs,
    });

    currentMatches = nextMatches;
  }

  await competition.save();
}


// export async function generateTournamentNoGroup(competition) {
//   const equipes = shuffleArray(
//     competition.equipesInscrites.map(e => (e._id ? e._id : e))
//   );

//   const nbEquipes = equipes.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   if (!competition.terrains?.length) {
//     throw new Error("Aucun terrain défini");
//   }

//   const terrain = competition.terrains[0];
//   const proprietaire = competition.organisateur;

//   competition.calendrier = [];

//   /* ================================
//      1️⃣ PREMIER TOUR
//   ================================= */
//   let currentMatches = [];

//   for (let i = 0; i < equipes.length; i += 2) {
//     const match = await Match.create({
//       terrain,
//       proprietaire,
//       type: "COMPETITION",
//       mode: "EQUIPE",
//       competition: competition._id,
//       equipeA: equipes[i],
//       equipeB: equipes[i + 1],
//       statut: "Ouvert",
//     });

//     currentMatches.push(match);
//   }

//   competition.calendrier.push({
//     tour: getTourName(currentMatches.length * 2),
//     matchs: currentMatches.map(m => ({
//       equipeA: m.equipeA,
//       equipeB: m.equipeB,
//       matchId: m._id,
//       fromMatchA: null,
//       fromMatchB: null,
//     })),
//   });

//   /* ================================
//      2️⃣ TOURS SUIVANTS (DEMI / FINALE)
//   ================================= */
//   while (currentMatches.length > 1) {
//     currentMatches = shuffleArray(currentMatches);

//     const nextMatches = [];
//     const calendrierMatchs = [];

//     for (let i = 0; i < currentMatches.length; i += 2) {
//       // ✅ ON CRÉE LE MATCH EN BASE (OBLIGATOIRE)
//       const match = await Match.create({
//         terrain,
//         proprietaire,
//         type: "COMPETITION",
//         mode: "EQUIPE",
//         competition: competition._id,
//         equipeA: null,
//         equipeB: null,
//         statut: "Ouvert",
//       });

//       calendrierMatchs.push({
//         equipeA: null,
//         equipeB: null,
//         matchId: match._id,
//         fromMatchA: currentMatches[i]._id,
//         fromMatchB: currentMatches[i + 1]._id,
//       });

//       nextMatches.push(match);
//     }

//     competition.calendrier.push({
//       tour: getTourName(currentMatches.length),
//       matchs: calendrierMatchs,
//     });

//     currentMatches = nextMatches;
//   }
// }




// export async function generateTournamentNoGroup(competition) {
//   const equipes = shuffleArray(
//     competition.equipesInscrites.map(e => e._id ? e._id : e)
//   );

//   const nbEquipes = equipes.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   if (!competition.terrains?.length) {
//     throw new Error("Aucun terrain défini");
//   }

//   const terrain = competition.terrains[0];
//   const proprietaire = competition.organisateur;

//   competition.calendrier = [];

//   // 🔹 1. PREMIER TOUR
//   let currentMatches = [];

//   for (let i = 0; i < equipes.length; i += 2) {
//     const match = await Match.create({
//       terrain,
//       proprietaire,
//       type: "COMPETITION",
//       mode: "EQUIPE",
//       competition: competition._id,
//       equipeA: equipes[i],
//       equipeB: equipes[i + 1],
//       statut: "Ouvert",
//     });

//     currentMatches.push(match);
//   }

//   competition.calendrier.push({
//     tour: getTourName(equipes.length),
//     matchs: currentMatches.map(m => ({
//       equipeA: m.equipeA,
//       equipeB: m.equipeB,
//       matchId: m._id,
//       fromMatchA: null,
//       fromMatchB: null,
//     })),
//   });

//   // 🔹 2. TOURS SUIVANTS
//   while (currentMatches.length > 1) {
//     currentMatches = shuffleArray(currentMatches);

//     const nextRoundMatches = [];
//     const calendrierMatchs = [];

//     for (let i = 0; i < currentMatches.length; i += 2) {
//       calendrierMatchs.push({
//         equipeA: null,
//         equipeB: null,
//         matchId: null,
//         fromMatchA: currentMatches[i]._id,
//         fromMatchB: currentMatches[i + 1]._id,
//       });

//       nextRoundMatches.push({
//         _id: new mongoose.Types.ObjectId(), // placeholder logique
//       });
//     }

//     competition.calendrier.push({
//       tour: getTourName(currentMatches.length),
//       matchs: calendrierMatchs,
//     });

//     currentMatches = nextRoundMatches;
//   }
// }



// export async function generateTournamentNoGroup(competition) {
//   const equipes = shuffleArray(
//     competition.equipesInscrites.map(e => e._id ? e._id : e)
//   );

//   const nbEquipes = equipes.length;
//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   const terrain = competition.terrains[0];
//   const proprietaire = competition.organisateur;

//   competition.calendrier = [];

//   /* ==========================
//      🟢 PREMIER TOUR
//   ========================== */
//   let currentMatches = [];

//   for (let i = 0; i < equipes.length; i += 2) {
//     const match = await Match.create({
//       terrain,
//       proprietaire,
//       type: "COMPETITION",
//       mode: "EQUIPE",
//       competition: competition._id,
//       equipeA: equipes[i],
//       equipeB: equipes[i + 1],
//       statut: "Ouvert",
//     });

//     currentMatches.push({
//       matchId: match._id,
//       equipeA: equipes[i],
//       equipeB: equipes[i + 1],
//       fromMatchA: null,
//       fromMatchB: null,
//     });
//   }

//   competition.calendrier.push({
//     tour: getTourName(equipes.length),
//     matchs: currentMatches,
//   });

//   /* ==========================
//      🔁 TOURS SUIVANTS
//   ========================== */
//   let nbMatchs = currentMatches.length;

//   while (nbMatchs > 1) {
//     const shuffled = shuffleArray(currentMatches);
//     let nextRound = [];

//     for (let i = 0; i < shuffled.length; i += 2) {
//       nextRound.push({
//         matchId: null, // créé plus tard
//         equipeA: null,
//         equipeB: null,
//         fromMatchA: shuffled[i].matchId,
//         fromMatchB: shuffled[i + 1].matchId,
//       });
//     }

//     competition.calendrier.push({
//       tour: getTourName(nbMatchs * 2),
//       matchs: nextRound,
//     });

//     currentMatches = nextRound;
//     nbMatchs = nextRound.length;
//   }
// }

// function shuffleArray(array) {
//   const arr = [...array]; // copie pour ne pas modifier l’original
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }



// export async function generateTournamentNoGroup(competition) {
//   const equipes = shuffleArray(
//     competition.equipesInscrites.map(e => e._id ? e._id : e)
//   );

//   const nbEquipes = equipes.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   if (!competition.terrains || competition.terrains.length === 0) {
//     throw new Error("Aucun terrain défini");
//   }

//   const terrain = competition.terrains[0];
//   const proprietaire = competition.organisateur;

//   let equipesTour = equipes;
//   let currentEquipesCount = nbEquipes;

//   competition.calendrier = []; // sécurité

//   while (currentEquipesCount >= 2) {
//     const tour = getTourName(currentEquipesCount);
//     let matchs = [];

//     // 🟢 PREMIER TOUR → matchs réels
//     if (currentEquipesCount === nbEquipes) {
//       for (let i = 0; i < equipesTour.length; i += 2) {
//         const match = await Match.create({
//           terrain,
//           proprietaire,
//           type: "COMPETITION",
//           mode: "EQUIPE",
//           competition: competition._id,
//           equipeA: equipesTour[i],
//           equipeB: equipesTour[i + 1],
//           statut: "Ouvert",
//         });

//         matchs.push({
//           equipeA: equipesTour[i],
//           equipeB: equipesTour[i + 1],
//           matchId: match._id,
//         });
//       }
//     } 
//     // 🟡 TOURS SUIVANTS → placeholders
//     else {
//       for (let i = 0; i < equipesTour.length; i += 2) {
//         matchs.push({
//           equipeA: null,
//           equipeB: null,
//           matchId: null,
//         });
//       }
//     }

//     competition.calendrier.push({ tour, matchs });

//     // ⏭️ Préparer taille tour suivant
//     equipesTour = new Array(matchs.length).fill(null);
//     currentEquipesCount /= 2;
//   }
// }




// import Match from "../models/matchModel.js";

// export function getTourName(nbEquipes) {
//   switch (nbEquipes) {
//     case 2:
//       return "FINALE";
//     case 4:
//       return "DEMI_FINALE";
//     case 8:
//       return "QUART_DE_FINALE";
//     case 16:
//       return "HUITIEME_DE_FINALE";
//     case 32:
//       return "SEIZIEME_DE_FINALE";
//     default:
//       return `TOUR_${nbEquipes}`;
//   }
// }

// function shuffleArray(array) {
//   const arr = [...array]; // copie pour ne pas modifier l’original
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
//   return arr;
// }


// export async function generateTournamentNoGroup(competition) {
//   const equipesShuffled = shuffleArray(
//     competition.equipesInscrites.map((e) => e._id ? e._id : e)
//   );

//   const nbEquipes = equipesShuffled.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   // ✅ sécurité
//   if (!competition.terrains || competition.terrains.length === 0) {
//     throw new Error("Aucun terrain défini pour la compétition");
//   }

//   const terrain = competition.terrains[0];
//   const proprietaire = competition.organisateur;

//   let currentEquipesCount = nbEquipes;
//   let isFirstTour = true;

//   while (currentEquipesCount >= 2) {
//     const tour = getTourName(currentEquipesCount);
//     let matchs = [];

//     if (isFirstTour) {
//       for (let i = 0; i < equipesShuffled.length; i += 2) {
//         const equipeA = equipesShuffled[i];
//         const equipeB = equipesShuffled[i + 1];

//         // ✅ MATCH COMPLET (VALIDATION OK)
//         const match = await Match.create({
//           terrain,
//           proprietaire,
//           type: "COMPETITION",
//           mode: "EQUIPE",
//           competition: competition._id,
//           equipeA,
//           equipeB,
//           statut: "Ouvert",
//         });

//         matchs.push({
//           equipeA,
//           equipeB,
//           matchId: match._id,
//         });
//       }

//       isFirstTour = false;
//     }

//     competition.calendrier.push({
//       tour,
//       matchs,
//     });

//     currentEquipesCount /= 2;
//   }
// }
