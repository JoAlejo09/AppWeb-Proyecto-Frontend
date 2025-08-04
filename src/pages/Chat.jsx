// src/pages/Chat.jsx
import { useEffect, useState } from "react";
import { socket } from "../services/socket"; // importa la instancia
import { useAuthStore } from "../store/StoreAuth"; // si usas Zustand para datos del usuario

const Chat = () => {
  const usuario = useAuthStore((state) => state.usuario); // trae el usuario si lo tienes guardado
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("Conectado al servidor Socket.io");
    });

    socket.on("mensaje", (data) => {
      setMensajes((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
    });

    return () => {
      socket.off("mensaje");
      socket.disconnect();
    };
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim() === "") return;

    socket.emit("mensaje", {
      de: usuario?.nombre || "Anónimo",
      mensaje,
    });

    setMensaje("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chat en tiempo real</h1>

      <div className="border rounded-lg p-4 h-64 overflow-y-scroll mb-4 bg-gray-100">
        {mensajes.map((m, i) => (
          <div key={i} className="mb-2">
            <strong>{m.de}:</strong> {m.mensaje}
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
