// src/socket.js
import { io } from "socket.io-client";

const token = localStorage.getItem("token"); // o desde Zustand si prefieres

export const socket = io("https://mentalapp-backend-rqqe.onrender.com", {
  auth: {
    token: `Bearer ${token}`,
  },
  transports: ["websocket"], // mejora compatibilidad
});
