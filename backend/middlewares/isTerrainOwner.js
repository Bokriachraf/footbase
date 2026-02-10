import Match from "../models/matchModel.js";

const isTerrainOwner = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id);
  
    if (!match) {
      return res.status(404).send({ message: "Match introuvable" });
    }

    if (match.proprietaire.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: "Accès refusé (propriétaire uniquement)" });
    }

    // on attache le match pour éviter un refetch
    req.match = match;
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

export default isTerrainOwner;
