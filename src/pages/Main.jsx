import React from "react";
import { useNavigate } from "react-router-dom";

const Main = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-cover bg-center" style={{ backgroundImage: "url('/freepik.jpeg')" }}>
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 flex items-center justify-center h-full px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-xl p-10 shadow-lg text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bienvenido a <span className="text-purple-300">MentalAPP</span>
          </h1>
          <p className="text-white text-md mb-6">Tu espacio para el bienestar mental</p>

          <div className="flex flex-col gap-4">
            <button
              className="py-2 px-4 bg-purple-600 hover:bg-purple-800 text-white rounded-md transition"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
            <button
              className="py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white rounded-md transition"
              onClick={() => navigate("/registro")}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;