import Competition from "../models/competitionModel.js";



const isCompetitionOwner = async (req, res, next) => {
  const competition = await Competition.findById(req.params.id);
  if (!competition) {
    return res.status(404).send({ message: "Compétition introuvable" });
  }

  if (competition.organisateur.toString() !== req.user._id.toString()) {
    return res.status(403).send({ message: "Accès réservé à l’organisateur" });
  }

  req.competition = competition;
  next();
};
export default isCompetitionOwner