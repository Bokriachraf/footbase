import mongoose from "mongoose";

/* 🔹 Match LÉGER pour calendrier */
const calendrierMatchSchema = new mongoose.Schema(
  {
    equipeA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipe",
      default: null,
    },
    equipeB: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipe",
      default: null,
    },
    matchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Match", // 🔗 lien vers la collection matches
      default: null,
    },
     fromMatchA: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    default: null,
  },
  fromMatchB: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Match",
    default: null,
  },
  },
  { _id: false }
);

/* 🔹 Tour du calendrier */
const calendrierSchema = new mongoose.Schema(
  {
    tour: {
      type: String,
      enum: [
        "SEIZIEME_DE_FINALE",
        "HUITIEME_DE_FINALE",
        "QUART_DE_FINALE",
        "DEMI_FINALE",
        "FINALE",
      ],
      required: true,
    },
    matchs: [calendrierMatchSchema],
  },
  { _id: false }
);

export default calendrierSchema;



