import Equipe from '../models/equipeModel.js';

export const createAutoTeams = async (match) => {
  if (!match || match.mode !== 'INDIVIDUEL') return;

  // 🔐 Sécurité
  if (!Array.isArray(match.joueurs) || match.joueurs.length === 0) {
    throw new Error('Aucun joueur pour créer les équipes');
  }

  if (match.joueurs.length % 2 !== 0) {
    throw new Error('Nombre de joueurs impair');
  }

  const joueurs = match.joueurs;

  // 🧭 Groupement strict par poste (données propres)
  const byPosition = {
    Gardien: [],
    Défenseur: [],
    Milieu: [],
    Attaquant: [],
  };

  joueurs.forEach(j => {
    if (!j?._id) return;

    const position = j.position || 'Milieu';

    if (!byPosition[position]) {
      byPosition.Milieu.push(j);
    } else {
      byPosition[position].push(j);
    }
  });

  // 📊 Log de contrôle (temporaire)
  console.log('📊 Postes:', {
    gardiens: byPosition.Gardien.length,
    defenseurs: byPosition.Défenseur.length,
    milieux: byPosition.Milieu.length,
    attaquants: byPosition.Attaquant.length,
  });

  // 🔢 Tri par rating décroissant
  Object.values(byPosition).forEach(group => {
    group.sort(
      (a, b) =>
        (Number(b.averageRating) || 0) -
        (Number(a.averageRating) || 0)
    );
  });

  const teamA = [];
  const teamB = [];

  const targetSize = joueurs.length / 2;

  // ⚖️ Fonction d'ajout sécurisé
  const pushBalanced = (playerId) => {
    if (teamA.length < targetSize) {
      teamA.push(playerId);
    } else {
      teamB.push(playerId);
    }
  };

  // 🟢 1️⃣ Distribution équilibrée par poste
  Object.values(byPosition).forEach(group => {
    for (let i = 0; i < group.length; i++) {
      const player = group[i];

      if (teamA.length < teamB.length) {
        teamA.push(player._id);
      } else {
        teamB.push(player._id);
      }
    }
  });

  // 🛑 Sécurité finale
  if (teamA.length !== teamB.length) {
    throw new Error(
      `Équipes déséquilibrées (${teamA.length} vs ${teamB.length})`
    );
  }

  // 🏗️ Création DB
  const equipeA = await Equipe.create({
    nom: 'Équipe A',
    joueurs: teamA,
    score: 0,
  });

  const equipeB = await Equipe.create({
    nom: 'Équipe B',
    joueurs: teamB,
    score: 0,
  });

  match.equipes = [equipeA._id, equipeB._id];
  await match.save();

  console.log('✅ Équipes créées', {
    equipeA: teamA.length,
    equipeB: teamB.length,
  });
};



// import Equipe from '../models/equipeModel.js';

// /**
//  * ⚽ Création automatique de 2 équipes équilibrées
//  * - Mode INDIVIDUEL uniquement
//  * - Équilibrage :
//  *   1. Par nombre total (PRIORITAIRE)
//  *   2. Par poste
//  *   3. Par niveau (averageRating)
//  */
// export const createAutoTeams = async (match) => {
//   if (!match || match.mode !== 'INDIVIDUEL') return;

//   const joueurs = match.joueurs;

//   // 🛑 Sécurités de base
//   if (!Array.isArray(joueurs) || joueurs.length === 0) {
//     throw new Error('Aucun joueur disponible pour créer les équipes');
//   }

//   if (joueurs.length % 2 !== 0) {
//     throw new Error('Nombre de joueurs impair – impossible de créer 2 équipes équilibrées');
//   }

//   // 🔁 Normalisation des positions (tolérant aux fautes)
//   const normalizePosition = (pos = '') => {
//     const p = pos.toLowerCase();
//     if (p.includes('gard')) return 'Gardien';
//     if (p.includes('def')) return 'Défenseur';
//     if (p.includes('mil')) return 'Milieu';
//     if (p.includes('atta') || p.includes('avant')) return 'Attaquant';
//     return 'Milieu'; // fallback intelligent
//   };

//   // 📦 Regroupement par poste
//   const byPosition = {
//     Gardien: [],
//     Défenseur: [],
//     Milieu: [],
//     Attaquant: [],
//   };

//   joueurs.forEach((j) => {
//     if (!j || !j._id) return;

//     const position = normalizePosition(j.position);
//     const rating = Number(j.averageRating) || 0;

//     byPosition[position].push({
//       _id: j._id,
//       rating,
//     });
//   });

//   // 🛑 Vérification finale
//   const totalGrouped = Object.values(byPosition)
//     .reduce((acc, group) => acc + group.length, 0);

//   if (totalGrouped !== joueurs.length) {
//     throw new Error('Erreur de regroupement des joueurs');
//   }

//   // 🔢 Tri par niveau décroissant (si tous à 0 → ordre naturel)
//   Object.values(byPosition).forEach(group => {
//     group.sort((a, b) => b.rating - a.rating);
//   });

//   const teamA = [];
//   const teamB = [];

//   /**
//    * ⚖️ RÈGLE CLÉ :
//    * Toujours ajouter le joueur à l’équipe la PLUS PETITE
//    * → garantit 7v7, 6v6, etc.
//    */
//   const orderedPositions = ['Gardien', 'Défenseur', 'Milieu', 'Attaquant'];

//   orderedPositions.forEach(position => {
//     byPosition[position].forEach(player => {
//       if (teamA.length <= teamB.length) {
//         teamA.push(player._id);
//       } else {
//         teamB.push(player._id);
//       }
//     });
//   });

//   // 🛑 Sécurité finale
//   if (teamA.length !== teamB.length) {
//     throw new Error(
//       `Équipes déséquilibrées (${teamA.length} vs ${teamB.length})`
//     );
//   }

//   // 💾 Création des équipes
//   const equipeA = await Equipe.create({
//     nom: 'Équipe A',
//     joueurs: teamA,
//     score: 0,
//   });

//   const equipeB = await Equipe.create({
//     nom: 'Équipe B',
//     joueurs: teamB,
//     score: 0,
//   });

//   // 🔗 Liaison au match
//   match.equipes = [equipeA._id, equipeB._id];
//   await match.save();

//   console.log('✅ Équipes générées automatiquement', {
//     equipeA: teamA.length,
//     equipeB: teamB.length,
//   });
// };

