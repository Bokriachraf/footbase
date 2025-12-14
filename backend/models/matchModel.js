import mongoose from 'mongoose';


const matchSchema = new mongoose.Schema({
  terrain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Terrain",
    required: true,
  },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proprietaire",
    required: true,
  },

  mode: {
    type: String,
    enum: ["INDIVIDUEL", "EQUIPE"],
    default: "INDIVIDUEL",
  },

  joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" }],

  equipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Equipe" }],

  date: { type: String, required: true },
  heure: { type: String, required: true },

  niveau: {
    type: String,
    enum: ["Débutant", "Intermédiaire", "Avancé"],
    default: "Intermédiaire",
  },

  statut: {
    type: String,
    enum: ["Ouvert", "Complet", "Terminé"],
    default: "Ouvert",
  },

  prixParJoueur: Number,

  scoreFinal: { type: String, default: null },
  noteAttribuee: { type: Boolean, default: false },
});


// const matchSchema = new mongoose.Schema({
//   terrain: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Terrain", // on relie au terrain directement
//     required: true,
//   },
//    proprietaire: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Proprietaire",
//     required: true,
//   },
//   joueurs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" }],
//   date: { type: String, required: true },
//   heure: { type: String, required: true },
//   niveau: {
//     type: String,
//     enum: ["Débutant", "Intermédiaire", "Avancé"],
//     default: "Intermédiaire",
//   },
//   statut: {
//     type: String,
//     enum: ["Ouvert", "Complet", "Terminé"],
//     default: "Ouvert",
//   },
//   prixParJoueur: { type: Number },

//   equipes: [
//   {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Equipe'
//   }
// ],
// scoreFinal: {
//   type: String, // ex: "4 - 2"
//   default: null,
// },
// noteAttribuee: { type: Boolean, default: false },
// });
const Match = mongoose.model("Match", matchSchema);
export default Match;