import express from "express";
import Competition from "../models/competitionModel.js";
import expressAsyncHandler from "express-async-handler"
import { isAuth } from '../utils.js';
import Equipe from "../models/equipeModel.js";

const competitionRouter = express.Router();

/* =====================================================
   GET /api/competitions
   → Liste de toutes les compétitions
   ===================================================== */
competitionRouter.get("/", async (req, res) => {
  try {
    const competitions = await Competition.find()
      .populate("organisateur", "name email")
      .populate("terrains", "nom adresse")
      .sort({ createdAt: -1 });

    res.json(competitions);
  } catch (error) {
    console.error("GET competitions error:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des compétitions",
    });
  }
});

/* =====================================================
   GET /api/competitions/:id
   → Détails d'une compétition
   ===================================================== */

competitionRouter.get("/:id", async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate("organisateur", "name email")
      .populate("terrains", "nom adresse")
      .populate({
        path: "equipesInscrites",
        select: "nom logo capitaine",
        populate: {
          path: "capitaine",
          select: "name position",
        },
      });

    if (!competition) {
      return res.status(404).json({
        message: "Compétition introuvable",
      });
    }

    res.json(competition);
  } catch (error) {
    console.error("GET competition by id error:", error);
    res.status(500).json({
      message: "Erreur lors de la récupération de la compétition",
    });
  }
});


   // competitionRouter.get("/:id", async (req, res) => {
//   try {
//     const competition = await Competition.findById(req.params.id)
//       .populate("organisateur", "name email")
//       .populate("terrains", "nom adresse")
//       .populate("equipesInscrites", "nom logo");

//     if (!competition) {
//       return res.status(404).json({
//         message: "Compétition introuvable",
//       });
//     }

//     res.json(competition);
//   } catch (error) {
//     console.error("GET competition by id error:", error);
//     res.status(500).json({
//       message: "Erreur lors de la récupération de la compétition",
//     });
//   }
// });

competitionRouter.post(
  "/",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {
      nom,
      type,
      categorie,
      gouvernorat,
      saison,
      terrains,
      dateDebut,
      dateFin,
      nbEquipes,
    } = req.body;

    const competition = new Competition({
      nom,
      type,
      categorie,
      gouvernorat,
      saison,
      terrains,
      dateDebut,
      dateFin,
      nbEquipes,
      organisateur: req.user._id, // ✅ propriétaire connecté
    });

    const createdCompetition = await competition.save();
    res.status(201).json(createdCompetition);
  })
);

// POST /api/competitions/:id/register-equipe
competitionRouter.post(
  '/:id/register-equipe',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { equipeId } = req.body;

    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).send({ message: 'Compétition introuvable' });
    }

    // équipe existe ?
    const equipe = await Equipe.findById(equipeId);
    if (!equipe) {
      return res.status(404).send({ message: 'Équipe introuvable' });
    }

    // capitaine uniquement
    if (equipe.capitaine.toString() !== req.user._id.toString()) {
      return res.status(403).send({ message: 'Capitaine uniquement' });
    }

    // déjà inscrite ?
    if (
      competition.equipesInscrites.some(
        (e) => e.toString() === equipeId
      )
    ) {
      return res.status(400).send({ message: 'Équipe déjà inscrite' });
    }

    // compétition complète ?
    if (
      competition.equipesInscrites.length >= competition.nbEquipes
    ) {
      return res.status(400).send({ message: 'Compétition complète' });
    }

    competition.equipesInscrites.push(equipeId);
    await competition.save();

    res.send({
      message: 'Équipe inscrite avec succès',
      competition,
    });
  })
);

// competitionRouter.post(
//   "/:id/register",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const { equipeId } = req.body;

//     const competition = await Competition.findById(req.params.id);

//     if (!competition) {
//       return res.status(404).send({ message: "Compétition introuvable" });
//     }

//     // 🔒 compétition ouverte ?
//     if (competition.status !== "OUVERT") {
//       return res.status(400).send({ message: "Compétition non ouverte" });
//     }

//     // 🔒 déjà pleine ?
//     if (competition.equipesInscrites.length >= competition.nbEquipes) {
//       return res
//         .status(400)
//         .send({ message: "Nombre maximum d'équipes atteint" });
//     }

//     // 🔒 équipe déjà inscrite ?
//     if (competition.equipesInscrites.includes(equipeId)) {
//       return res.status(400).send({ message: "Équipe déjà inscrite" });
//     }

//     competition.equipesInscrites.push(equipeId);
//     await competition.save();

//     res.send({
//       message: "Inscription réussie ✅",
//       competition,
//     });
//   })
// );


export default competitionRouter;




// import express from "express";
// import Competition from "../models/competitionModel.js";
// import { isAuth } from '../utils.js';


// const competitionRouter = express.Router();
// // CREATE competition
// competitionRouter.post("/", isAuth, async (req, res) => {
//   try {
//     const competition = new Competition({
//       nom: req.body.nom,
//       type: req.body.type,
//       categorie: req.body.categorie,
//       gouvernorat: req.body.gouvernorat,
//       etablissement: req.body.etablissement,
//       entreprise: req.body.entreprise,
//       terrains: req.body.terrains,
//       saison: req.body.saison,
//       logo: req.body.logo,
//       organisateur: req.user._id,
//     });

//     const createdCompetition = await competition.save();
//     res.status(201).json(createdCompetition);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// });

// competitionRouter.get("/", async (req, res) => {
//   try {
//     const competitions = await Competition.find()
//       .populate("organisateur", "name email")
//       .populate("terrains", "nom adresse")
//       .sort({ createdAt: -1 });

//     res.json(competitions);
//   } catch (error) {
//     console.error("GET competitions error:", error);
//     res.status(500).json({
//       message: "Erreur lors de la récupération des compétitions",
//     });
//   }
// });

// /* =====================================================
//    GET /api/competitions/:id
//    → Détails d'une compétition
//    ===================================================== */
// competitionRouter.get("/:id", async (req, res) => {
//   try {
//     const competition = await Competition.findById(req.params.id)
//       .populate("organisateur", "name email")
//       .populate("terrains", "nom adresse")
//       .populate("equipesInscrites", "nom logo");

//     if (!competition) {
//       return res.status(404).json({
//         message: "Compétition introuvable",
//       });
//     }

//     res.json(competition);
//   } catch (error) {
//     console.error("GET competition by id error:", error);
//     res.status(500).json({
//       message: "Erreur lors de la récupération de la compétition",
//     });
//   }
// });


/* =====================================================
   POST /api/competitions
   → Création d'une compétition (propriétaire)
   ===================================================== */
// competitionRouter.post("/", isAuth, async (req, res) => {
//   try {
//     const competition = new Competition({
//       ...req.body,
//       organisateur: req.user._id, // propriétaire connecté
//     });

//     const createdCompetition = await competition.save();
//     res.status(201).json(createdCompetition);
//   } catch (error) {
//     console.error("CREATE competition error:", error);
//     res.status(400).json({
//       message: "Impossible de créer la compétition",
//     });
//   }
// });


// competitionRouter.post(
//   "/",
//   isAuth,
//   async (req, res) => {
//     const {
//       nom,
//       type,
//       categorie,
//       gouvernorat,
//       etablissement,
//       entreprise,
//       terrains,
//       saison,
//       dateDebut,
//       dateFin,
//       nbEquipes,
//     } = req.body;

//     const competition = new Competition({
//       nom,
//       type,
//       categorie,
//       gouvernorat,
//       etablissement,
//       entreprise,
//       terrains,
//       saison,
//       dateDebut,
//       dateFin,
//       nbEquipes,
//       organisateur: req.user._id,
//       equipesInscrites: [], // ✅ sécurité
//       status: "OUVERT",
//     });

//     const created = await competition.save();
//     res.status(201).json(created);
//   }
// );


// /* =====================================================
//    POST /api/competitions/:id/inscription
//    → Inscription d'une équipe
//    ===================================================== */
// competitionRouter.post("/:id/inscription", isAuth, async (req, res) => {
//   try {
//     const { equipeId } = req.body;
//     const competition = await Competition.findById(req.params.id);

//     if (!competition) {
//       return res.status(404).json({ message: "Compétition introuvable" });
//     }

//     if (competition.status !== "OUVERT") {
//       return res
//         .status(400)
//         .json({ message: "Les inscriptions sont fermées" });
//     }

//     if (competition.equipesInscrites.includes(equipeId)) {
//       return res
//         .status(400)
//         .json({ message: "Équipe déjà inscrite" });
//     }

//     if (
//       competition.equipesInscrites.length >= competition.nbEquipes
//     ) {
//       return res
//         .status(400)
//         .json({ message: "Nombre maximum d'équipes atteint" });
//     }

//     competition.equipesInscrites.push(equipeId);
//     await competition.save();

//     res.json({
//       message: "Inscription réussie",
//       competition,
//     });
//   } catch (error) {
//     console.error("INSCRIPTION competition error:", error);
//     res.status(500).json({
//       message: "Erreur lors de l'inscription",
//     });
//   }
// });

// export default competitionRouter;
