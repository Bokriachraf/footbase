// src/components/NotificationPanel.jsx
"use client";

import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearNotification,markNotificationRead } from "../redux/actions/notificationActions";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";



const API = process.env.NEXT_PUBLIC_API_URL;

export default function NotificationPanel({ open, onClose }) {
  const dispatch = useDispatch();
  const panelRef = useRef(null);

  // notifications from redux
  const notifications  = useSelector((state) => state.notifications.list || []);
  const isInvitation = notifications?.type === "INVITATION";
  const unread = notifications.filter((n) => !n.read);

  // for pop-animation on newly received notif
  const [flashId, setFlashId] = useState(null);
  const prevCountRef = useRef(unread.length);
  const { footballeurInfo } = useSelector(
  (state) => state.footballeurSignin
);


const acceptInvitation = async (invitationId,notificationsId) => {
  try {
  await axios.patch(
    `${API}/api/invitations/${invitationId}/accept`,
    {},
    {
      headers: {
        Authorization: `Bearer ${footballeurInfo.token}`,
      },
    }
  );
  toast.success("✅ Invitation acceptée");
     dispatch(clearNotification(notificationsId));
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de l’acceptation");
    }
  };

 const refuseInvitation = async (invitationId,notificationsId) => {
    try {
      await axios.patch(
        `${API}/api/invitations/${invitationId}/refuse`,
        {},
        {
          headers: {
            Authorization: `Bearer ${footballeurInfo.token}`,
          },
        }
      );

       toast.info("❌ Invitation refusée");
           dispatch(markNotificationRead(notificationsId));

        dispatch(clearNotification(notificationsId));

    } catch (err) {
      console.error(err);
      toast.error("Erreur lors du refus");
    }
  };

  // bottom-sheet positions (fractions of viewport height)
  const POS = {
    full: 0.90, // 90% height => top = vh * 0.10
    medium: 0.55,
    mini: 0.20,
  };

  // sheetTopValue (px top value). On mobile we animate 'top' numeric.
  const [sheetTop, setSheetTop] = useState(null);
  // Resist threshold to close on drag
  const CLOSE_THRESHOLD = 120;

  // Detect mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 820);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // when open -> set initial top based on medium pos
  useEffect(() => {
    if (!open) return;
    const vh = window.innerHeight;
    const targetTop = Math.round(vh * (1 - POS.medium));
    setSheetTop(targetTop);
    // lock body scroll while open
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // pop animation: detect new unread pushed into array
  useEffect(() => {
    const prev = prevCountRef.current;
    if (unread.length > prev) {
      // new notification(s) arrived: flash the latest unread
      const last = unread[unread.length - 1];
      if (last) {
        setFlashId(last._id || null);
        // clear flash after 900ms
        setTimeout(() => setFlashId(null), 900);
      }
    }
    prevCountRef.current = unread.length;
  }, [unread]);

  // click outside to close -> for desktop drawer
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      const panel = panelRef.current;
      if (panel && !panel.contains(e.target)) {
        onClose();
      }
    }
    window.addEventListener("mousedown", onDocClick);
    return () => window.removeEventListener("mousedown", onDocClick);
  }, [open, onClose]);

  const handleMarkRead = (id) => {
    dispatch(clearNotification(id));
  };

  // Drag end handler (mobile bottom sheet)
  const onDragEndMobile = (event, info) => {
    try {
      // get panel bounding top (current visual top while dragging)
      const rect = panelRef.current?.getBoundingClientRect();
      if (!rect) return;

      const currentTop = rect.top; // px from viewport top
      const vh = window.innerHeight;

      // compute absolute candidate tops for snaps
      const topFull = Math.round(vh * (1 - POS.full)); // near top
      const topMedium = Math.round(vh * (1 - POS.medium));
      const topMini = Math.round(vh * (1 - POS.mini)); // small visible

      // pick the nearest snap top
      const candidates = [
        { name: "full", value: topFull },
        { name: "medium", value: topMedium },
        { name: "mini", value: topMini },
      ];

      // If user dragged far down (offset.y big) and velocity downwards -> close
      const offsetY = info.offset.y;
      const velocityY = info.velocity.y;

      if ((offsetY > CLOSE_THRESHOLD && velocityY > 200) || currentTop > topMini + 160) {
        // close if dragged decisively down
        // vibrate small if supported
        if (navigator.vibrate) navigator.vibrate(20);
        onClose();
        return;
      }

      // else snap to nearest
      let nearest = candidates[0];
      let minD = Math.abs(currentTop - candidates[0].value);
      for (let c of candidates) {
        const d = Math.abs(currentTop - c.value);
        if (d < minD) {
          nearest = c;
          minD = d;
        }
      }
      setSheetTop(nearest.value);
      // small gentle vibrate on snap
      if (navigator.vibrate) navigator.vibrate(10);
    } catch (e) {
      console.warn("onDragEndMobile error", e);
    }
  };

  // Render panel (portal)
  const panel = (
    <AnimatePresence>
      {open && (
        <>
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[9800]"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
            onClick={onClose}
          />

          {/* SHEET / DRAWER */}
          {/* Mobile: bottom-sheet (positioned by 'top' CSS) */}
          <motion.div
            ref={panelRef}
            className={`fixed left-0 ${
              isMobile ? "" : "right-0"
            } z-[9900] w-full sm:w-[420px] rounded-t-2xl sm:rounded-none`}
            style={{
              // if mobile: anchored via top; if desktop: anchored right:0 top:0 bottom:0
              ...(isMobile
                ? {
                    top: sheetTop ?? "100%",
                    height: "auto",
                    maxHeight: "85vh",
                  }
                : {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    height: "100vh",
                  }),
              // glass + LED neon border
              background:
                "linear-gradient(180deg, rgba(8,10,12,0.92), rgba(10,12,15,0.86))",
              backdropFilter: "blur(14px) saturate(160%)",
              border: "1px solid rgba(255,255,255,0.06)",
              boxShadow:
                "0 12px 30px rgba(0,0,0,0.6), 0 6px 20px rgba(0,0,0,0.45)",
              overflow: "hidden",
            }}
            initial={isMobile ? { top: "100%" } : { x: "100%" }}
            animate={isMobile ? { top: sheetTop ?? "100%" } : { x: 0 }}
            exit={isMobile ? { top: "100%" } : { x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 28,
            }}
            drag={isMobile ? "y" : false}
            dragConstraints={isMobile ? { top: -9999, bottom: 9999 } : undefined}
            dragElastic={0.15}
            onDragEnd={isMobile ? onDragEndMobile : undefined}
          >
            {/* TOP LED accent */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                height: 6,
                top: -6,
                filter: "blur(8px)",
                pointerEvents: "none",
                background:
                  "linear-gradient(90deg, rgba(20,220,255,0.95), rgba(60,255,160,0.92), rgba(20,220,255,0.95))",
                opacity: 0.9,
              }}
            />

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/8">
              <div className="flex items-center gap-3">
                {/* small handle for mobile */}
                {isMobile && (
                  <div className="hidden sm:block" />
                )}
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <div className="text-xs text-white/60 ml-2">
                  {unread.length} non lues
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="p-2 rounded hover:bg-white/5 text-white"
                  aria-label="Fermer"
                >
                  <X />
                </button>
              </div>
            </div>

            {/* content */}
            <div
              className="p-4 overflow-y-auto"
              style={{ maxHeight: isMobile ? "calc(85vh - 64px)" : "100%" }}
            >
              {unread.length === 0 ? (
                <div className="text-white/70 text-center py-10">
                  Aucune nouvelle notification
                </div>
              ) : (
                <div className="space-y-3">
                  {unread.map((n) => {
                    const isFlashing = flashId && flashId === n._id;
                    return (
                      <motion.div
                        key={n._id}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          boxShadow: isFlashing
                            ? "0 8px 30px rgba(34,197,94,0.18)"
                            : "0 6px 20px rgba(0,0,0,0.35)",
                          scale: isFlashing ? [1, 1.02, 1] : 1,
                        }}
                        transition={{ duration: 0.42 }}
                        className="rounded-xl p-3 border border-white/8"
                        style={{
                          background: "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01))",
                        }}
                      >
                        <div className="flex justify-between gap-3">
                          <div className="flex-1">
                            <div className="text-white font-semibold text-sm">{n.title}</div>
                            <div className="text-white/80 text-sm mt-1">{n.message}</div>

 {/* {n.type === "INVITATION" && n.statut === "EN_ATTENTE" && ( */}
 
 {n.type === "INVITATION" &&
  n.invitation &&
  n.invitation.statut === "EN_ATTENTE" && (

     <div className="flex gap-2 mt-3">
              <button
                onClick={() => acceptInvitation(n.invitation._id, n._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
              >
                Accepter
              </button>

              <button
                onClick={() => refuseInvitation(n.invitation._id, n._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Refuser
              </button>
            </div>

 
)}




                            {/* show note/comment if present in notif object */}
                            {typeof n.note !== "undefined" && (
                              <div className="mt-2 text-yellow-400 font-semibold text-sm">
                                ⭐ Note : {n.note}/5
                              </div>
                            )}
                            {n.commentaire && (
                              <div className="mt-1 text-white/70 italic text-sm">“{n.commentaire}”</div>
                            )}

                            <div className="text-xs text-white/50 mt-2">
                              
                              {n.match && <span className="ml-2">• Match {String(n.match).slice(0, 8)}</span>}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 items-end">
                            <button
                              onClick={() => handleMarkRead(n._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Marquer comme lu
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
              </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  if (typeof document === "undefined") return null;
  return createPortal(panel, document.body);
}


