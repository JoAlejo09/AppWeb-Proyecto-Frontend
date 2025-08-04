import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import {jwtDecode} from 'jwt-decode'; 
import storeAuth from "../store/storeAuth"; // Importa tu store de Zustand



const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/login`;
      const response = await axios.post(url, data);
      toast.success(response.data.msg || "Inicio de sesión exitoso");
      localStorage.setItem("usuario", JSON.stringify(response.data.usuario));

      const rol = data.rol;
      if (rol === "admin") {
        navigate("/admin");
      } else if (rol === "paciente") {
        navigate("/paciente");
      }
    } catch (error) {
      const mensaje = error.response?.data?.msg || "Error al iniciar sesión";
      toast.error(mensaje);
    }
  };
  const RedesSociales = ()=>{
    const navigate = useNavigate();

    useEffect(()=>{
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if(token){
        try{
          const decoded = jwtDecode(token);
          console.log(decoded)
           storeAuth({
            token,
            user: {
              nombre: decoded.nombre || "",
              email: decoded.email || "",
            },
          rol: decoded.rol || "paciente", // fallback a 'paciente'
        });
        
        navigate("/paciente")
        }catch(error){
          console.error("Error al decodificar el token:", error);
          toast.error("Token inválido o expirado");
          navigate("/login");
        }
      }else{
        navigate("/login")
      }
    }, []);
    return <div className="text-center mt-10">Iniciando Sesion...</div>
  }

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <ToastContainer />

      {/* Imagen a la izquierda */}
      <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/bg-register.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>

      {/* Formulario */}
      <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Iniciar sesión</h1>
          <small className="text-gray-400 block my-4 text-sm text-center">Selecciona tu rol e ingresa tus datos</small>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Rol */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Rol</label>
              <select
                {...register("rol", { required: "Selecciona un rol" })}
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-700"
              >
                <option value="admin">Administrador</option>
                <option value="paciente">Paciente</option>
              </select>
              {errors.rol && <p className="text-red-600 text-sm">{errors.rol.message}</p>}
            </div>

            {/* Correo */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                {...register("email", { required: "El correo es obligatorio" })}
                placeholder="tucorreo@ejemplo.com"
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-700"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            {/* Contraseña */}
            <div className="mb-3 relative">
              <label className="block text-sm font-semibold mb-1">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", { required: "La contraseña es obligatoria" })}
                placeholder="********"
                className="block w-full rounded-md border border-gray-300 px-2 py-1 text-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-700 pr-10"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-7 right-3 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Botón enviar */}
            <button className="bg-purple-700 text-white w-full py-2 rounded-md mt-4 hover:bg-purple-900 transition">
              Iniciar sesión
            </button>
          </form>

          {/* Enlaces inferiores */}
          <div className="mt-6 text-xs border-b-2 py-4"></div>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>¿Olvidaste tu contraseña?</p>
            <Link to="/recuperar" className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-900 transition">
              Recuperar
            </Link>
          </div>
      <div className="mt-6">
        <p className="text-center text-gray-500 text-sm mb-2">O inicia sesión con</p>
        <div className="flex flex-col gap-3">
          <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
          className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google" className="w-5 h-5"/>
            Google
          </a>
          <a href={`${import.meta.env.VITE_BACKEND_URL}/auth/facebook`}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          >
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg" alt="Facebook" className="w-5 h-5" />
            Facebook
            </a>
            </div>
      </div>
    </div>
    </div>
      </div>
  );
}; 

export default Login;
