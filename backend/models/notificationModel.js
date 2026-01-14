import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Footballeur",
    required: true,
  },

  // 🔥 TYPE DE NOTIFICATION
  type: {
    type: String,
    enum: ["EVALUATION", "INVITATION"],
    required: true,
  },

  title: { type: String, required: true },
  message: { type: String, required: true },

  // === EVALUATION ===
  note: { type: Number },
  commentaire: { type: String },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" },

  // === INVITATION ===
  invitation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Invitation",
  },
  equipe: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Equipe",
  },

  read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model("Notification", notificationSchema);


