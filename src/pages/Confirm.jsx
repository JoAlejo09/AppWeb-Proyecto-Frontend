import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Confirm = () => {
  const { token } = useParams();

  const verifyToken = async () => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/confirmar/${token}`;
      const respuesta = await axios.get(url);
      toast.success(respuesta?.data?.msg || "Cuenta confirmada con éxito");
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Error al confirmar la cuenta");
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 to-cyan-100">
      <ToastContainer />
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-md text-center">
        
        {/* Imagen temática salud mental */}
        <img
          src="/images/salud-mental.png"
          alt="Salud Mental"
          className="w-28 h-28 mx-auto mb-6"
        />

        <h1 className="text-3xl font-bold text-gray-800 mb-3">
          ¡Cuenta de Paciente Activada!
        </h1>
        <p className="text-gray-600 mb-6">
          Gracias por activar tu cuenta. Ahora puedes iniciar sesión y comenzar a usar la plataforma.
        </p>

        <Link
          to="/login"
          className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition"
        >
          Ir al Login
        </Link>
      </div>
    </div>
  );
};

export default Confirm;
