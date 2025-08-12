import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { io } from "socket.io-client";

// Usa tu URL de socket/backend. Idealmente define VITE_SOCKET_URL en .env
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  "http://localhost:3000";

export default function Chat() {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  // datos del usuario actual (nombre + rol)
  const [me, setMe] = useState({ name: "", role: "" });

  // si el chat ya está iniciado (si ya tenemos nombre/rol)
  const [chatStarted, setChatStarted] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const messagesEndRef = useRef(null);

  // 1) Resolver el usuario desde localStorage y empezar chat automáticamente
  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("usuario") || "{}");
    if (u?.rol) {
      setMe({
        name: u.rol === "admin" ? "Admin" : (u.nombre || "Paciente"),
        role: u.rol
      });
      setChatStarted(true);
    }
  }, []);

  // 2) Conectar socket con auth opcional (token JWT si lo usas)
  useEffect(() => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");

    const s = io(SOCKET_URL, {
      transports: ["websocket", "polling"], // prioritiza websocket
      auth: token ? { token: `Bearer ${token}` } : undefined,
    });

    setSocket(s);

    s.on("connect", () => console.log("Socket conectado:", s.id));
    s.on("enviar-mensaje-front-back", (payload) => {
      // se espera payload: { body, fromName, fromRole, at }
      setMessages((prev) => [...prev, payload]);
    });
    s.on("disconnect", () => console.log("Socket desconectado"));

    return () => s.disconnect();
  }, []);

  // 3) Autoscroll al final cuando entra un mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4) Si el usuario no viene del login (sin rol), permitir entrar manualmente
  const startChat = ({ name }) => {
    setMe((prev) => ({ ...prev, name: name.trim() || prev.name || "Usuario" }));
    setChatStarted(true);
  };

  // 5) Enviar mensaje
  const sendMessage = ({ message }) => {
    if (!socket) return;
    const payload = {
      body: message,
      fromName: me.name,
      fromRole: me.role, // "admin" o "paciente" si lo tienes cargado
      at: Date.now(),
    };
    socket.emit("enviar-mensaje-front-back", payload);
    setMessages((prev) => [...prev, payload]); // también lo agregamos localmente
    reset({ message: "" });
  };

  // Componente de burbuja
  const Bubble = ({ msg }) => {
    const isMine = msg.fromName === me.name && msg.fromRole === me.role;
    const containerClass = isMine ? "justify-end" : "justify-start";
    const bubbleClass = isMine
      ? "bg-indigo-600 text-white rounded-l-lg rounded-tr-lg"
      : "bg-gray-700 text-white rounded-r-lg rounded-tl-lg";
    const chipClass = isMine ? "bg-indigo-500" : "bg-gray-600";

    return (
      <div className={`w-full flex ${containerClass}`}>
        <div className="max-w-[75%]">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-[11px] px-2 py-0.5 rounded-full ${chipClass}`}>
              {msg.fromRole || "usuario"}
            </span>
            <span className="text-[11px] text-gray-300">{msg.fromName}</span>
            {msg.at && (
              <span className="text-[10px] text-gray-400">
                {new Date(msg.at).toLocaleTimeString()}
              </span>
            )}
          </div>
          <div className={`px-3 py-2 ${bubbleClass}`}>
            <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
          </div>
        </div>
      </div>
    );
  };

  // Si aún no ha iniciado chat (no viene de login con rol)
  if (!chatStarted) {
    return (
      <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Ingresa al chat</h2>
        <form onSubmit={handleSubmit(startChat)} className="space-y-3">
          <input
            type="text"
            placeholder="Tu nombre"
            className="w-full border rounded px-3 py-2"
            {...register("name", { required: "El nombre es obligatorio" })}
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // Chat iniciado
  return (
    <div className="max-w-3xl mx-auto h-[80vh] flex flex-col bg-white rounded shadow mt-6">
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Chat</h3>
          <p className="text-xs text-gray-500">
            Conectado como {me.name} ({me.role || "usuario"})
          </p>
        </div>
      </div>

      {/* Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((m, idx) => (
          <Bubble key={idx} msg={m} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit(sendMessage)} className="p-3 border-t flex gap-2">
        <input
          type="text"
          placeholder="Escribe tu mensaje..."
          className="flex-1 border rounded px-3 py-2"
          {...register("message", { required: "El mensaje es obligatorio" })}
        />
        <button className="bg-green-600 hover:bg-green-700 text-white rounded px-4">
          Enviar
        </button>
      </form>
    </div>
  );
}
