import { io } from "socket.io-client";

let socket = null;

export function getSocket() {
  if (!socket && typeof window !== "undefined") {
    socket = io(process.env.NEXT_PUBLIC_API_BASE_URL, {
      transports: ["polling", "websocket"],
      autoConnect: false,
      reconnection: true,
    });
  }
  return socket;
}


