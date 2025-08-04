// src/pages/Chat.jsx
import { useEffect, useState } from "react";
import { getSocket } from "../services/socket.js";
import storeAuth from "../store/storeAuth.jsx";

const Chat = () => {
  const usuario = storeAuth((state) => state.user);
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = getSocket();
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Conectado al servidor Socket.io");
    });

    newSocket.on("enviar-mensaje-front-back", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    newSocket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    return () => {
      newSocket.off("enviar-mensaje-front-back");
      newSocket.disconnect();
    };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim() === "" || !socket) return;

    socket.emit("enviar-mensaje-front-back", {
      body: mensaje,
    });

    setMensaje("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat en tiempo real</h1>

      <div className="border rounded-lg p-4 h-64 overflow-y-scroll mb-4 bg-gray-100">
        {mensajes.map((m, i) => (
          <div key={i} className="mb-2">
            <strong>{m.from}:</strong> {m.body}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button
          onClick={enviarMensaje}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default Chat;