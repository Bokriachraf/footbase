import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Footballeur", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },

  // 🔥 AJOUTER :
  note: { type: Number },
  commentaire: { type: String },

  sourceUser: { type: mongoose.Schema.Types.ObjectId, ref: "Footballeur" },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" },
  read: { type: Boolean, default: false },
}, { timestamps: true });


export default mongoose.model("Notification", notificationSchema);
