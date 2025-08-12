import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import storeAuth from "../context/storeAuth"; // Zustand store

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  // Acceder al store Zustand
  const setToken = storeAuth((state) => state.setToken);
  const setNombre = storeAuth((state) => state.setNombre);
  const setRol = storeAuth((state) => state.setRol);

  const onSubmit = async (data) => {
    try {
      setCargando(true);
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/login`;
      const response = await axios.post(url, data);

      toast.success(response.data.msg || "Inicio de sesión exitoso");

      // Guardar en Zustand
      setToken(response.data.token);
      setNombre(response.data.usuario.nombre);
      setRol(response.data.usuario.rol);

      // Redirigir según rol
      const rol = response.data.usuario.rol;
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "paciente") {
        navigate("/paciente");
      }
    } catch (error) {
      const mensaje = error.response?.data?.msg || "Error al iniciar sesión";
      toast.error(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <ToastContainer />

      {/* Fondo con gradiente animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 animate-[pulse_10s_ease-in-out_infinite]" />

      {/* Imagen decorativa (opcional) */}
      <div
        className="absolute inset-0 opacity-20 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-register.jpeg')" }}
      />

      {/* Overlay oscuro suave */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Lado izquierdo: mensaje / branding */}
        <div className="hidden md:flex flex-col justify-center text-white space-y-4">
          <h1 className="text-4xl font-extrabold drop-shadow-md">
            Bienvenido a <span className="text-yellow-300">MentalAPP</span>
          </h1>
          <p className="text-white/90 leading-relaxed">
            Plataforma para el acompañamiento y seguimiento de la salud mental. Accede a recursos,
            cuestionarios, chat y herramientas diseñadas para apoyar tu bienestar.
          </p>
          <ul className="text-white/90 space-y-2 mt-2">
            <li>• Contenido y recursos especializados</li>
            <li>• Cuestionarios y registro de avance</li>
            <li>• Comunicación en tiempo real con el administrador</li>
          </ul>
        </div>

        {/* Lado derecho: formulario */}
        <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/40">
          {/* Logo / título */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500">Selecciona tu rol e ingresa tus datos</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Rol */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Rol</label>
              <div className="relative">
                <select
                  {...register("rol", { required: "Selecciona un rol" })}
                  className="block w-full rounded-md border border-gray-300 pl-3 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="admin">Administrador</option>
                  <option value="paciente">Paciente</option>
                </select>
                <span className="absolute right-3 top-2.5 text-gray-400">▾</span>
              </div>
              {errors.rol && (
                <p className="text-red-600 text-xs mt-1">{errors.rol.message}</p>
              )}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correo electrónico</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">📧</span>
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email", { required: "El correo es obligatorio" })}
                  placeholder="tucorreo@ejemplo.com"
                  className="block w-full rounded-md border border-gray-300 pl-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Contraseña</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: "La contraseña es obligatoria" })}
                  placeholder="********"
                  className="block w-full rounded-md border border-gray-300 pl-10 pr-12 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500 hover:text-gray-700"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Botón enviar */}
            <button
              disabled={cargando}
              className={`w-full py-2.5 rounded-md text-white font-semibold transition
                ${cargando ? "bg-indigo-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}
              `}
            >
              {cargando ? "Procesando..." : "Iniciar sesión"}
            </button>
          </form>

          {/* Separador */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white/80 px-2 text-gray-500">o inicia con</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="space-y-3">
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-2.5 rounded-md hover:bg-red-600 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </a>
            <a
              href={`${import.meta.env.VITE_BACKEND_URL}/auth/facebook`}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-md hover:bg-blue-700 transition"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                alt="Facebook"
                className="w-5 h-5"
              />
              Facebook
            </a>
          </div>

          {/* Recuperar */}
          <div className="mt-6 text-sm flex items-center justify-between text-gray-600">
            <span>¿Olvidaste tu contraseña?</span>
            <Link
              to="/recuperar"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Recuperar
            </Link>
          </div>

          {/* Registro */}
          <div className="mt-3 text-sm text-center">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link
              to="/registro"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
