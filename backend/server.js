import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from "http";
import { Server } from "socket.io";
import { connectDB } from './config/db.js';

import footballeurRouter from './routes/footballeurRoute.js';
import matchRouter from './routes/matchRoutes.js';
import proprietaireRouter from './routes/proprietaireRoutes.js';
import terrainRouter from './routes/terrainRoutes.js';
import participationRouter from './routes/participationRoutes.js';
import evaluationRouter from "./routes/evaluationRoutes.js";
import notificationRouter from "./routes/notificationRoutes.js";
import equipeRouter from './routes/equipeRoute.js';
import invitationRouter from './routes/invitationRoutes.js';


dotenv.config();

// 🟢 Connexion DB
connectDB();

// 🟢 Création app
const app = express();

// 🟢 CORS dynamique (dev + prod)
const allowedOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL,   // (Vercel)
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🟢 Routes API
app.use('/api/footballeurs', footballeurRouter);
app.use('/api/proprietaires', proprietaireRouter);
app.use('/api/terrains', terrainRouter);
app.use('/api/matchs', matchRouter);
app.use('/api/participations', participationRouter);
app.use("/api/evaluations", evaluationRouter);
app.use("/api/notifications", notificationRouter);
app.use('/api/equipes', equipeRouter);
app.use('/api/invitations', invitationRouter);



// 🟢 Serveur HTTP
const server = http.createServer(app);

// 🟢 Socket.io sécurisé PROD + DEV
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  }
});

// 🟢 Gestion Websocket
io.on("connection", (socket) => {
  console.log("Client connecté →", socket.id);

  socket.on("registerUser", (userId) => {
    socket.join(userId);
  });

  socket.on("leaveUser", (userId) => {
    try {
      socket.leave(userId);
    } catch (e) {}
  });

  socket.on("disconnect", () => {
    console.log("Client déconnecté:", socket.id);
  });
});

// 🟢 Render impose son port → pas touche !
const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`🔥 Server + Socket.io running on port ${PORT}`)
);




// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import http from "http";
// import { Server } from "socket.io";
// import { connectDB } from './config/db.js';

// import footballeurRouter from './routes/footballeurRoute.js';
// import matchRouter from './routes/matchRoutes.js';
// import proprietaireRouter from './routes/proprietaireRoutes.js';
// import terrainRouter from './routes/terrainRoutes.js';
// import participationRouter from './routes/participationRoutes.js';
// import evaluationRouter from "./routes/evaluationRoutes.js";
// import notificationRouter from "./routes/notificationRoutes.js";


// dotenv.config();
// connectDB();

// const app = express();

// app.use(cors({ origin: "*" }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // ROUTES
// app.use('/api/footballeurs', footballeurRouter);
// app.use('/api/proprietaires', proprietaireRouter);
// app.use('/api/terrains', terrainRouter);
// app.use('/api/matchs', matchRouter);
// app.use('/api/participations', participationRouter);
// app.use("/api/evaluations", evaluationRouter);
// app.use("/api/notifications", notificationRouter);


// // 🔥 1. Créer un serveur HTTP
// const server = http.createServer(app);

// // 🔥 2. Initialiser Socket.io
// export const io = new Server(server, {
//   cors: { origin: "*", methods: ["GET", "POST"] }
// });

// // 🔥 3. Gestion Socket.io
// io.on("connection", (socket) => {
//   console.log("Client connecté →", socket.id);

//   // ↪️ Enregistrer un utilisateur dans une "room"
//   socket.on("registerUser", (userId) => {
//     socket.join(userId);
//     console.log("User joined room:", userId);
//   });

//   // 🔥 NOUVEAU : Forcer un leave d’une room
//   socket.on("leaveUser", (userId) => {
//     try {
//       socket.leave(userId);
//       console.log("User left room:", userId);
//     } catch (e) {
//       console.warn("leaveUser error", e);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("Client déconnecté:", socket.id);
//   });
// });

// // PORT
// const PORT = process.env.PORT || 5000;
// server.listen(PORT, () =>
//   console.log(`Server + Socket.io running on port ${PORT}`)
// );


