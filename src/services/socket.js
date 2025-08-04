// src/socket.js
import { io } from "socket.io-client";
import storeAuth from "../store/storeAuth";

const token = storeAuth.getState().token; // Obtiene el token del estado de Zustand

// Crea la instancia de Socket.io con el token de autenticación

export const socket = io("https://mentalapp-backend-rqqe.onrender.com", {
  auth: {
    token: `Bearer ${token}`,
  },
  transports: ["websocket"], // mejora compatibilidad
});
