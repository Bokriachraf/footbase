import Match from "../models/matchModel.js";

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
  const arr = [...array]; // copie pour ne pas modifier l’original
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}


export async function generateTournamentNoGroup(competition) {
  const equipesShuffled = shuffleArray(
    competition.equipesInscrites.map((e) => e._id ? e._id : e)
  );

  const nbEquipes = equipesShuffled.length;

  if ((nbEquipes & (nbEquipes - 1)) !== 0) {
    throw new Error("Le nombre d'équipes doit être une puissance de 2");
  }

  // ✅ sécurité
  if (!competition.terrains || competition.terrains.length === 0) {
    throw new Error("Aucun terrain défini pour la compétition");
  }

  const terrain = competition.terrains[0];
  const proprietaire = competition.organisateur;

  let currentEquipesCount = nbEquipes;
  let isFirstTour = true;

  while (currentEquipesCount >= 2) {
    const tour = getTourName(currentEquipesCount);
    let matchs = [];

    if (isFirstTour) {
      for (let i = 0; i < equipesShuffled.length; i += 2) {
        const equipeA = equipesShuffled[i];
        const equipeB = equipesShuffled[i + 1];

        // ✅ MATCH COMPLET (VALIDATION OK)
        const match = await Match.create({
          terrain,
          proprietaire,
          type: "COMPETITION",
          mode: "EQUIPE",
          competition: competition._id,
          equipeA,
          equipeB,
          statut: "Ouvert",
        });

        matchs.push({
          equipeA,
          equipeB,
          matchId: match._id,
        });
      }

      isFirstTour = false;
    }

    competition.calendrier.push({
      tour,
      matchs,
    });

    currentEquipesCount /= 2;
  }
}

// export async function generateTournamentNoGroup(competition) {
//   // 🔀 Tirage aléatoire des équipes
//   const equipesShuffled = shuffleArray(
//     competition.equipesInscrites.map((e) => e._id ? e._id : e)
//   );

//   const nbEquipes = equipesShuffled.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   let currentEquipesCount = nbEquipes;
//   let isFirstTour = true;

//   while (currentEquipesCount >= 2) {
//     const tour = getTourName(currentEquipesCount);
//     let matchs = [];

//     if (isFirstTour) {
//       for (let i = 0; i < equipesShuffled.length; i += 2) {
//         const equipeA = equipesShuffled[i];
//         const equipeB = equipesShuffled[i + 1];

//         // 🔥 Création du match COMPLET
//         const match = await Match.create({
//           type: "COMPETITION",
//           mode: "EQUIPE",
//           competition: competition._id,
//           equipeA,
//           equipeB,
//           date: competition.dateDebut,
//           heure: "00:00",
//           statut: "Ouvert",
//         });

//         // 🔗 Ajout au calendrier
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


// export function generateTournamentNoGroup(competition) {
//   const nbEquipes = competition.equipesInscrites.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   // 🎲 TIRAGE AU SORT
//   let equipes = shuffleArray(competition.equipesInscrites);

//   let currentEquipesCount = nbEquipes;

//   while (currentEquipesCount >= 2) {
//     const tour = getTourName(currentEquipesCount);
//     let matchs = [];

//     for (let i = 0; i < equipes.length; i += 2) {
//       matchs.push({
//         equipeA: equipes[i],
//         equipeB: equipes[i + 1],
//       });
//     }

//     competition.calendrier.push({
//       tour,
//       matchs,
//     });

//     // Placeholder pour vainqueurs du tour suivant
//     equipes = new Array(matchs.length).fill(null);
//     currentEquipesCount /= 2;
//   }
// }


// export function generateTournamentNoGroup(competition) {
//   const equipes = [...competition.equipesInscrites];
//   const nbEquipes = equipes.length;

//   if ((nbEquipes & (nbEquipes - 1)) !== 0) {
//     throw new Error("Le nombre d'équipes doit être une puissance de 2");
//   }

//   let currentEquipesCount = nbEquipes;
//   let isFirstTour = true;

//   while (currentEquipesCount >= 2) {
//     const tour = getTourName(currentEquipesCount);

//     let matchs = [];

//     if (isFirstTour) {
//       for (let i = 0; i < equipes.length; i += 2) {
//         matchs.push({
//           equipeA: equipes[i],
//           equipeB: equipes[i + 1],
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
