import mongoose from 'mongoose';


const terrainSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  ville: { type: String, required: true },
  typeGazon: { type: String, enum: ["Naturel", "Synthétique"], required: true },
  capacite: { type: Number, required: true },
  prixHeure: { type: Number, required: true },
  proprietaire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proprietaire",
    required: true,
  },
});
const Terrain = mongoose.model("Terrain", terrainSchema);
export default Terrain;