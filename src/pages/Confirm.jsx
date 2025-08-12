import { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Confirm = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [estado, setEstado] = useState("loading"); // 'loading' | 'success' | 'error'
  const [mensaje, setMensaje] = useState("");
  const [contador, setContador] = useState(5);
  const timerRef = useRef(null);

  const verifyToken = async () => {
    setEstado("loading");
    setMensaje("");
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/confirmar/${token}`;
      const { data } = await axios.get(url);
      const msg = data?.msg || "Cuenta confirmada con éxito";
      setEstado("success");
      setMensaje(msg);
      toast.success(msg, { autoClose: 2500 });

      // Redirige en 5 segundos al login
      let c = 5;
      setContador(c);
      timerRef.current = setInterval(() => {
        c -= 1;
        setContador(c);
        if (c <= 0) {
          clearInterval(timerRef.current);
          navigate("/login");
        }
      }, 1000);
    } catch (error) {
      const msg = error?.response?.data?.msg || "Error al confirmar la cuenta";
      setEstado("error");
      setMensaje(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    verifyToken();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 via-cyan-200 to-sky-200 px-4">
      <ToastContainer />
      <div
        className="bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8 md:p-10 w-full max-w-md text-center border border-white/50"
        role="status"
        aria-live="polite"
      >
        {/* Encabezado con imagen/ícono según estado */}
        {estado === "loading" && (
          <>
            <div className="animate-pulse mb-6">
              <div className="mx-auto w-24 h-24 bg-teal-100 rounded-full" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Validando tu cuenta…</h1>
            <p className="text-gray-600">Estamos confirmando tu token. Por favor, espera unos segundos.</p>
          </>
        )}

        {estado === "success" && (
          <>
            <img
              src="/images/salud-mental.png"
              alt="Cuenta confirmada"
              className="w-26 h-26 mx-auto mb-4"
            />
            <h1 className="text-3xl font-extrabold text-teal-700 mb-2">¡Cuenta Activada!</h1>
            <p className="text-gray-700">{mensaje}</p>
            <p className="text-sm text-gray-500 mt-2">
              Serás redirigido al <span className="font-semibold">Login</span> en{" "}
              <span className="font-bold">{contador}</span> segundos…
            </p>

            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/login"
                className="inline-block bg-teal-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-teal-700 transition"
              >
                Ir al Login ahora
              </Link>
              <Link
                to="/"
                className="inline-block border border-teal-600 text-teal-700 font-semibold px-6 py-3 rounded-lg hover:bg-teal-50 transition"
              >
                Volver al inicio
              </Link>
            </div>
          </>
        )}

        {estado === "error" && (
          <>
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-red-500 mx-auto"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.35 17c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-red-600 mb-2">No se pudo confirmar tu cuenta</h1>
            <p className="text-gray-700 mb-4">
              {mensaje}. Verifica que tu enlace no haya expirado o ya haya sido usado.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={verifyToken}
                className="bg-red-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-red-700 transition"
              >
                Reintentar
              </button>
              <Link
                to="/login"
                className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Ir al Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Confirm;
