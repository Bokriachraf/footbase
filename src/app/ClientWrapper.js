"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSocket } from "../utils/socket";
import {
  addNotification,
  loadNotifications,
} from "../redux/actions/notificationActions";
import { toast } from "react-toastify";

export default function ClientWrapper({ children }) {
  const dispatch = useDispatch();

  const { footballeurInfo } = useSelector((state) => state.footballeurSignin || {});
  const { proprietaireInfo } = useSelector((state) => state.proprietaireSignin || {});
  const currentUser = footballeurInfo || proprietaireInfo;

  const socketRef = useRef(null);

  // 1) Connection socket only once
  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    if (!socket.connected) {
      socket.connect();

      socket.on("connect", () =>
        console.log("🟢 Socket connected:", socket.id)
      );

      socket.on("connect_error", (err) =>
        console.warn("⚠️ socket connect_error:", err)
      );
    }

    return () => {};
  }, []);

// 2) Register user + receive live notifications
useEffect(() => {
  const socket = socketRef.current;
  if (!socket) return;

  if (currentUser && currentUser._id) {
    console.log("Registering user room:", currentUser._id);
    socket.emit("registerUser", currentUser._id);

    // ================= ÉVALUATION =================
    const evaluationHandler = (notif) => {
      console.log("🔔 Evaluation reçue:", notif);
      dispatch(addNotification(notif));
      toast.info("📢 Nouvelle évaluation reçue !");
    };
    socket.on("evaluationReceived", evaluationHandler);

    // ================= INVITATION REÇUE =================
    const invitationHandler = (notif) => {
      console.log("📩 Invitation reçue:", notif);
      dispatch(addNotification(notif));
      toast.info("📨 Nouvelle invitation à une équipe !");
    };
    socket.on("invitationReceived", invitationHandler);

    // ================= INVITATION ACCEPTÉE =================
    const invitationAcceptedHandler = (notif) => {
      console.log("✅ Invitation acceptée:", notif);
      dispatch(addNotification(notif));
      toast.success("✅ Invitation acceptée");
    };
    socket.on("invitationAccepted", invitationAcceptedHandler);

    // ================= INVITATION REFUSÉE =================
    const invitationRefusedHandler = (notif) => {
      console.log("❌ Invitation refusée:", notif);
      dispatch(addNotification(notif));
      toast.error("❌ Invitation refusée");
    };
    socket.on("invitationRefused", invitationRefusedHandler);

    return () => {
      socket.emit("leaveUser", currentUser._id);

      socket.off("evaluationReceived", evaluationHandler);
      socket.off("invitationReceived", invitationHandler);
      socket.off("invitationAccepted", invitationAcceptedHandler);
      socket.off("invitationRefused", invitationRefusedHandler);
    };
  }
}, [currentUser, dispatch]);

useEffect(() => {
  if (currentUser && currentUser._id) {
    console.log("📥 Loading saved notifications...");
    dispatch(loadNotifications());
  }
}, [currentUser, dispatch]);

 return <>{children}</>;
}




// "use client";

// import { useEffect, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getSocket } from "../utils/socket";
// import {
//   addNotification,
//   loadNotifications,
// } from "../redux/actions/notificationActions";
// import { toast } from "react-toastify";

// export default function ClientWrapper({ children }) {
//   const dispatch = useDispatch();

//   const { footballeurInfo } = useSelector((state) => state.footballeurSignin || {});
//   const { proprietaireInfo } = useSelector((state) => state.proprietaireSignin || {});
//   const currentUser = footballeurInfo || proprietaireInfo;

//   const socketRef = useRef(null);

//   // 1) Connection socket only once
//   useEffect(() => {
//     const socket = getSocket();
//     socketRef.current = socket;

//     if (!socket.connected) {
//       socket.connect();

//       socket.on("connect", () =>
//         console.log("🟢 Socket connected:", socket.id)
//       );

//       socket.on("connect_error", (err) =>
//         console.warn("⚠️ socket connect_error:", err)
//       );
//     }

//     return () => {};
//   }, []);

//   // 2) Register user + receive live notifications
//   useEffect(() => {
//     const socket = socketRef.current;
//     if (!socket) return;

//     if (currentUser && currentUser._id) {
//       console.log("Registering user room:", currentUser._id);
//       socket.emit("registerUser", currentUser._id);

//       const handler = (notif) => {
//         console.log("🔔 Received evaluationReceived:", notif);
//         dispatch(addNotification(notif));
//         toast.info("📢 Nouvelle évaluation reçue !");
//       };

//       socket.on("evaluationReceived", handler);

// const invitationHandler = (notif) => {
//   console.log("📩 Invitation reçue:", notif);
//   dispatch(addNotification(notif));
//   toast.info("📨 Nouvelle invitation à une équipe !");
// };

// socket.on("invitationReceived", invitationHandler);

//       return () => {
//         socket.emit("leaveUser", currentUser._id);
//         socket.off("evaluationReceived", handler);
//         socket.off("invitationReceived", invitationHandler);

//       };
//     } else {
//       socket.off("evaluationReceived");
//     }
//   }, [currentUser, dispatch]);

//   // 3) Load saved notifications from DB
//   useEffect(() => {
//     if (currentUser && currentUser._id) {
//       console.log("📥 Loading saved notifications...");
//       dispatch(loadNotifications());
//     }
//   }, [currentUser, dispatch]);

//   return <>{children}</>;
// }




