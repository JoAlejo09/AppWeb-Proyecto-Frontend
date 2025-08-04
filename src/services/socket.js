import { io } from "socket.io-client";
import storeAuth from "../store/storeAuth";

export function getSocket() {
  const token = storeAuth.getState().token;
  return io("https://mentalapp-backend-rqqe.onrender.com", {
    auth: {
      token: `Bearer ${token}`,
    },
    transports: ["websocket"],
  });
}