import { useEffect, useState } from "react";
import socket from "../socket";

const ChatPaciente = () => {
  const [mensaje, setMensaje] = useState("");
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    socket.on("enviar-mensaje-front-back", (msg) => {
      setMensajes((prev) => [...prev, { texto: msg, remitente: "admin" }]);
    });

    return () => socket.off("enviar-mensaje-front-back");
  }, []);

  const enviarMensaje = () => {
    if (mensaje.trim() !== "") {
      socket.emit("enviar-mensaje-front-back", mensaje);
      setMensajes((prev) => [...prev, { texto: mensaje, remitente: "yo" }]);
      setMensaje("");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Chat con el Administrador</h2>
      <div className="h-80 overflow-y-auto border p-2 mb-2 rounded bg-gray-50">
        {mensajes.map((msg, i) => (
          <div
            key={i}
            className={`p-2 mb-1 rounded ${
              msg.remitente === "yo" ? "bg-blue-200 text-right" : "bg-green-200"
            }`}
          >
            {msg.texto}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="border p-2 flex-1 rounded"
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          placeholder="Escribe tu mensaje..."
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={enviarMensaje}>
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatPaciente;
