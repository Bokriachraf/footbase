import mongoose from "mongoose";

const proprietaireSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    telephone: { type: String },
    gouvernorat: { type: String, required: true },
    terrains: [{ type: mongoose.Schema.Types.ObjectId, ref: "Terrain" }], // ✅ Ajouté
    isAdmin: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Proprietaire = mongoose.model("Proprietaire", proprietaireSchema);
export default Proprietaire;
