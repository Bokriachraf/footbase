import Equipe from '../models/equipeModel.js';

export const createAutoTeams = async (match) => {
  if (!match || match.mode !== 'INDIVIDUEL') return;

  const joueurs = match.joueurs;

  // 🛑 Sécurité absolue
  if (!Array.isArray(joueurs) || joueurs.length === 0) {
    throw new Error('Aucun joueur disponible pour créer les équipes');
  }

  if (joueurs.length % 2 !== 0) {
    throw new Error('Nombre de joueurs impair');
  }

  // 🔁 Normalisation des positions
  const normalizePosition = (pos = '') => {
    const p = pos.toLowerCase();
    if (p.includes('gard')) return 'Gardien';
    if (p.includes('def')) return 'Défenseur';
    if (p.includes('mil')) return 'Milieu';
    if (p.includes('atta') || p.includes('avant')) return 'Attaquant';
    return 'Milieu'; // fallback intelligent
  };

  const byPosition = {
    Gardien: [],
    Défenseur: [],
    Milieu: [],
    Attaquant: [],
  };

  joueurs.forEach(j => {
    if (!j || !j._id) return;

    const position = normalizePosition(j.position);
    const rating = Number(j.averageRating) || 0;

    byPosition[position].push({
      _id: j._id,
      rating,
    });
  });

  // 🛑 Vérification critique
  const totalGrouped = Object.values(byPosition)
    .reduce((acc, g) => acc + g.length, 0);

  if (totalGrouped === 0) {
    throw new Error('Aucun joueur correctement groupé par position');
  }

  // 🔢 Tri par rating décroissant
  Object.values(byPosition).forEach(group => {
    group.sort((a, b) => b.rating - a.rating);
  });

  const teamA = [];
  const teamB = [];

  // ⚖️ Répartition équilibrée par position
  Object.values(byPosition).forEach(group => {
    group.forEach((player, index) => {
      if (index % 2 === 0) teamA.push(player._id);
      else teamB.push(player._id);
    });
  });

  // 🛑 Dernière sécurité
  if (teamA.length === 0 || teamB.length === 0) {
    throw new Error('Équipes générées vides – arrêt');
  }

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

  console.log('✅ Équipes générées automatiquement', {
    equipeA: teamA.length,
    equipeB: teamB.length,
  });
};



// import Equipe from '../models/equipeModel.js';

// export const createAutoTeams = async (match) => {
//   if (match.mode !== 'INDIVIDUEL') return;

//   // ⚠️ joueurs DOIVENT être populés avec evaluations
//   const joueurs = match.joueurs;

//   if (joueurs.length % 2 !== 0) {
//     throw new Error('Nombre de joueurs impair');
//   }

//   const byPosition = {
//     Gardien: [],
//     Défenseur: [],
//     Milieu: [],
//     Attaquant: [],
//   };

//   joueurs.forEach(j => {
//     byPosition[j.position]?.push(j);
//   });

//   // Trier par rating général
//   Object.values(byPosition).forEach(group => {
//     group.sort((a, b) => b.averageRating - a.averageRating);
//   });

//   const teamA = [];
//   const teamB = [];

//   Object.values(byPosition).forEach(group => {
//     group.forEach((player, index) => {
//       if (index % 2 === 0) teamA.push(player._id);
//       else teamB.push(player._id);
//     });
//   });

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

//   match.equipes = [equipeA._id, equipeB._id];
//   await match.save();

//   console.log('✅ Équipes générées automatiquement');
// };



// import Equipe from "../models/equipeModel.js";
// import Footballeur from "../models/footballeurModel.js";

// export const createAutoTeams = async (match) => {
//   const joueurs = await Footballeur.find({
//     _id: { $in: match.joueurs },
//   });

//   // Trier par niveau décroissant
//   joueurs.sort(
//     (a, b) => levelScore[b.niveau] - levelScore[a.niveau]
//   );

//   const teamA = [];
//   const teamB = [];

//   joueurs.forEach((j, index) => {
//     index % 2 === 0 ? teamA.push(j._id) : teamB.push(j._id);
//   });

//   const equipeA = await Equipe.create({
//     nom: "Équipe A",
//     joueurs: teamA,
//     capitaine: teamA[0],
//     match: match._id,
//   });

//   const equipeB = await Equipe.create({
//     nom: "Équipe B",
//     joueurs: teamB,
//     capitaine: teamB[0],
//     match: match._id,
//   });

//   match.equipes = [equipeA._id, equipeB._id];
//   match.statut = "Complet";

//   await match.save();
// };
