import {useState} from "react";
import {useForm} from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import { generateAvatar, convertBlobToBase64 } from "../helpers/consultarIA.js";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Register(){
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [imagenPreview, setImagenPreview] = useState(null);
  const [generando, setGenerando] = useState(false);
  const navigate = useNavigate();
  const imagenArchivo = watch("imagenArchivo");

  const registrarUsuario = async (datos) => {
    try {
      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("apellido", datos.apellido); 
      formData.append("email", datos.email);
      formData.append("password", datos.password);

      if(imagenArchivo && imagenArchivo.length > 0) {
        formData.append("imagenArchivo", imagenArchivo[0]);
      }else if(imagenPreview) {
        formData.append("imagenIA", imagenPreview);
      }
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/registrar`, formData);
      toast.success("Usuario registrado exitosamente");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      toast.error("Hubo un error al registrar el usuario");
    }
  };
  const generarImagenIA = async () => {
    const prompt = watch("prompt");
    if (!prompt || prompt.trim() === "") {
      return toast.error("Debes escribir un prompt para generar la imagen.");
    }
    setGenerando(true);
    try {
      const blob = await generateAvatar(prompt);
      const base64 = await convertBlobToBase64(blob);
      setImagenPreview(base64);
      toast.success("Imagen generada con éxito");
    } catch (error) {
      console.error("Error generando imagen IA:", error);
      toast.error("No se pudo generar la imagen");
    } finally {
      setGenerando(false);
    }
  };
  return (
  <div className="flex flex-col sm:flex-row h-screen">
    <ToastContainer />
    <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
    <div className="md:w-4/5 sm:w-full">
    <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">Bienvenido(a)</h1>
    <small className="text-gray-400 block my-4 text-sm">Por favor ingresa tus datos</small>
          <form onSubmit={handleSubmit(registrarUsuario)}>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Nombre</label>
          <input
            type="text"
            {...register("nombre", { required: "El nombre es obligatorio" })}
            className="block w-full rounded-md border border-gray-300 px-2 py-1"
          />
          {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Apellido</label>
          <input
            type="text"
            {...register("apellido", { required: "El apellido es obligatorio" })}
            className="block w-full rounded-md border border-gray-300 px-2 py-1"
          />
          {errors.apellido && <p className="text-red-600 text-sm">{errors.apellido.message}</p>}
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Telefono (fijo o celular)</label>
          <input
            type="telefono"
            {...register("telefono", { required: "Numero telefónico es obligatorio" })}
            className="block w-full rounded-md border border-gray-300 px-2 py-1"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
          <input
            type="email"
            {...register("email", { required: "El correo es obligatorio" })}
            className="block w-full rounded-md border border-gray-300 px-2 py-1"
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-3 relative">
          <label className="block text-sm font-semibold mb-1">Contraseña</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("password", { required: "La contraseña es obligatoria" })}
            className="block w-full rounded-md border border-gray-300 px-2 py-1 pr-10"
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-7 right-3 text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Foto de perfil (opcional)</label>
          <input
            type="file"
            accept="image/*"
            {...register("imagenArchivo")}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-white file:text-gray-700 hover:file:bg-gray-100"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">O generar avatar con IA</label>
          <input
            type="text"
            {...register("prompt")}
            placeholder="Ej: gato astronauta"
            className="block w-full rounded-md border border-gray-300 px-2 py-1"
          />
          {!imagenArchivo?.length && (
            <button
              type="button"
              onClick={generarImagenIA}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition mt-2"
              disabled={generando}
            >
              {generando ? "Generando..." : "Generar imagen con IA"}
            </button>
          )}
        </div>

        {imagenPreview && (
          <div className="mb-3">
            <label className="block text-sm font-semibold mb-1">Vista previa:</label>
            <img
              src={imagenPreview}
              alt="Vista previa"
              className="rounded-md w-32 h-32 object-cover border"
            />
          </div>
        )}

        <button className="bg-purple-700 text-white w-full py-2 rounded-md mt-4 hover:bg-purple-900 transition">
          Registrarse
        </button>
      </form>

      <div className="mt-6 text-xs border-b-2 py-4"></div>

      <div className="mt-3 text-sm flex justify-between items-center">
        <p>¿Ya tienes una cuenta?</p>
        <Link
          to="/login"
          className="py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-900 transition"
        >
          Iniciar sesión
        </Link>
      </div>
    </div>
  </div>

  <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/freemp.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>
</div>
  );}
//export default Register;
