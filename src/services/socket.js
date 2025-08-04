// src/socket.js
import { io } from "socket.io-client";
import storeAuth from "../store/storeAuth";


const token = storeAuth.getState().token; // Obtiene el token del estado de Zustand


export const socket = io("https://mentalapp-backend-rqqe.onrender.com", {
  auth: {
    token: `Bearer ${token}`,
  },
  transports: ["websocket"], // mejora compatibilidad
});
