import mongoose from "mongoose";

const equipeSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },

    match: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match",
      required: true,
    },

    joueurs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Footballeur",
        required: true,
      },
    ],

    capitaine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Footballeur",
    },
       entraineur: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Footballeur", // ou User si plus tard
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Equipe = mongoose.model("Equipe", equipeSchema);
export default Equipe;
