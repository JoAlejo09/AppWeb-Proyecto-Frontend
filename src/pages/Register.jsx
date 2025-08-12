import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { generateAvatar, convertBlobToBase64 } from "../helpers/consultarIA.js";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    clearErrors,
    setValue,
  } = useForm();

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null); // preview de imagen (archivo o IA)
  const [generando, setGenerando] = useState(false);
  const navigate = useNavigate();

  const archivoImagen = watch("imagenArchivo");
  const promptIA = watch("prompt");

  useEffect(() => {
    if (archivoImagen && archivoImagen.length > 0) {
      const file = archivoImagen[0];
      if (!file.type.startsWith("image/")) {
        setError("imagenArchivo", { message: "El archivo debe ser una imagen" });
        return;
      }
      clearErrors("imagenArchivo");
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // limpiar IA si eligen archivo
      setValue("prompt", "");
      setValue("imagenIA", "");
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [archivoImagen, setError, clearErrors, setValue]);

  const generarImagenIA = async () => {
    if (!promptIA || promptIA.trim() === "") {
      return toast.error("Debes escribir un prompt para generar la imagen.");
    }
    if (archivoImagen?.length > 0) {
      return toast.error("Ya seleccionaste un archivo. Quita el archivo si deseas usar IA.");
    }
    setGenerando(true);
    try {
      const blob = await generateAvatar(promptIA.trim());
      if (!blob || !blob.type?.startsWith("image/")) {
        toast.error("La IA no devolvió una imagen válida. Intenta de nuevo.");
        return;
      }
      const base64 = await convertBlobToBase64(blob);
      setPreview(base64);
      setValue("imagenIA", base64);
      toast.success("Imagen generada con éxito");
    } catch (error) {
      console.error("Error generando imagen IA:", error);
      toast.error("No se pudo generar la imagen. Intenta en unos segundos.");
    } finally {
      setGenerando(false);
    }
  };

  const registrarUsuario = async (datos) => {
    try {
      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("apellido", datos.apellido);
      formData.append("telefono", datos.telefono);
      formData.append("email", datos.email);
      formData.append("password", datos.password);

      if (datos.imagenArchivo && datos.imagenArchivo.length > 0) {
        formData.append("imagen", datos.imagenArchivo[0]); // <-- clave esperada por backend
      } else if (datos.imagenIA) {
        formData.append("imagenIA", datos.imagenIA); // <-- base64 para IA
      }

      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/usuarios/registrar`, formData);
      toast.success("Usuario registrado. Revisa tu correo para activar la cuenta");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      const msg = error?.response?.data?.msg || "Hubo un error al registrar el usuario";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center px-4">
      <ToastContainer />
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Columna izquierda: Hero / Branding */}
        <div className="hidden md:flex flex-col text-white space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight drop-shadow-md">
            Bienvenido a <span className="text-yellow-300">MentalAPP</span>
          </h2>
          <p className="text-lg opacity-90">
            Crea tu cuenta para acceder a recursos, cuestionarios y herramientas diseñadas para cuidar tu salud mental.
          </p>
          <ul className="space-y-3 text-sm opacity-90">
            <li>💡 Contenido verificado y de calidad</li>
            <li>📝 Cuestionarios para autoevaluación</li>
            <li>🧠 Recomendaciones personalizadas</li>
          </ul>
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/30">
            <img
              src="/freemp.jpeg"
              alt="MentalAPP"
              className="object-cover w-full h-72 opacity-95"
            />
          </div>
        </div>

        {/* Columna derecha: Tarjeta del formulario */}
        <div className="backdrop-blur-xl bg-white/30 rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/40">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-white drop-shadow">
              Crea tu cuenta
            </h1>
            <p className="text-white/90 text-sm mt-2">
              Completa tus datos para comenzar
            </p>
          </div>

          <form onSubmit={handleSubmit(registrarUsuario)} className="space-y-4">
            {/* Nombre y Apellido */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold text-sm mb-1">Nombre</label>
                <input
                  type="text"
                  {...register("nombre", {
                    required: "El nombre es obligatorio",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                      message: "Solo letras permitidas",
                    },
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 letras",
                    },
                  })}
                  className="w-full rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  placeholder="Ej: José"
                />
                {errors.nombre && <p className="text-yellow-200 text-xs mt-1">{errors.nombre.message}</p>}
              </div>
              <div>
                <label className="block text-white font-semibold text-sm mb-1">Apellido</label>
                <input
                  type="text"
                  {...register("apellido", {
                    required: "El apellido es obligatorio",
                    pattern: {
                      value: /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/,
                      message: "Solo letras permitidas",
                    },
                    minLength: {
                      value: 3,
                      message: "Mínimo 3 letras",
                    },
                  })}
                  className="w-full rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  placeholder="Ej: Pila"
                />
                {errors.apellido && <p className="text-yellow-200 text-xs mt-1">{errors.apellido.message}</p>}
              </div>
            </div>

            {/* Teléfono y Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-semibold text-sm mb-1">Teléfono</label>
                <input
                  type="tel"
                  {...register("telefono", {
                    required: "El número telefónico es obligatorio",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "Solo números permitidos",
                    },
                    minLength: {
                      value: 7,
                      message: "Debe tener al menos 7 dígitos",
                    },
                    maxLength: {
                      value: 10,
                      message: "Máximo 10 dígitos",
                    },
                  })}
                  className="w-full rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  placeholder="0987654321"
                />
                {errors.telefono && <p className="text-yellow-200 text-xs mt-1">{errors.telefono.message}</p>}
              </div>
              <div>
                <label className="block text-white font-semibold text-sm mb-1">Correo electrónico</label>
                <input
                  type="email"
                  {...register("email", {
                    required: "El correo es obligatorio",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Correo inválido",
                    },
                  })}
                  className="w-full rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  placeholder="tucorreo@ejemplo.com"
                />
                {errors.email && <p className="text-yellow-200 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-white font-semibold text-sm mb-1">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                    minLength: {
                      value: 6,
                      message: "Mínimo 6 caracteres",
                    },
                  })}
                  className="w-full rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none pr-12"
                  placeholder="********"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-0 px-3 text-gray-600 hover:text-gray-800 transition"
                  title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <p className="text-yellow-200 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Imagen por archivo */}
            <div className="bg-white/20 border border-white/40 rounded-md p-3">
              <label className="block text-white font-semibold text-sm mb-2">Foto de perfil (opcional)</label>
              <input
                type="file"
                accept="image/*"
                {...register("imagenArchivo")}
                className="block w-full text-sm text-white placeholder-white/70 file:mr-4 file:py-2 file:px-4 file:border file:border-white/40 file:rounded-md file:bg-white/30 file:text-white hover:file:bg-white/40"
              />
              {errors.imagenArchivo && <p className="text-yellow-200 text-xs mt-1">{errors.imagenArchivo.message}</p>}
            </div>

            {/* Imagen con IA */}
            <div className="bg-white/20 border border-white/40 rounded-md p-3">
              <label className="block text-white font-semibold text-sm mb-2">
                Generar avatar con IA
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  {...register("prompt")}
                  placeholder="Ej: retrato minimalista en acuarela"
                  className="flex-1 rounded-md border border-white/50 bg-white/80 px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-yellow-300 focus:outline-none"
                  disabled={archivoImagen?.length > 0}
                />
                <button
                  type="button"
                  onClick={generarImagenIA}
                  disabled={generando || archivoImagen?.length > 0}
                  className={`px-4 py-2 rounded-md text-white bg-yellow-500 hover:bg-yellow-600 transition ${
                    generando ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {generando ? "Generando..." : "Generar"}
                </button>
              </div>
              <input type="hidden" {...register("imagenIA")} />
              <p className="text-[12px] text-yellow-100 mt-2">
                Si seleccionas un archivo, no podrás usar la IA (elimínalo para habilitar).
              </p>
            </div>

            {/* Previsualización */}
            {preview && (
              <div className="flex items-center gap-4 mt-2">
                <img
                  src={preview}
                  alt="Vista previa"
                  className="w-20 h-20 rounded-full object-cover border-2 border-white/60 shadow-md"
                />
                <span className="text-white/90 text-sm">Vista previa del avatar</span>
              </div>
            )}

            {/* Botón registrar */}
            <button
              className="w-full py-3 rounded-md bg-white text-indigo-700 font-bold shadow hover:shadow-lg hover:translate-y-[1px] transition"
            >
              Crear cuenta
            </button>
          </form>

          {/* divisor */}
          <div className="mt-6 border-t border-white/40"></div>

          {/* Acciones secundarias */}
          <div className="mt-4 text-sm flex justify-between items-center text-white/90">
            <p>¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="py-2 px-4 bg-indigo-800/80 text-white rounded-md hover:bg-indigo-900 transition"
            >
              Iniciar sesión
            </Link>
          </div>

          {/* Registro social */}
          <div className="mt-6">
            <p className="text-center text-white/90 text-sm mb-2">O regístrate con</p>
            <div className="flex flex-col gap-3">
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
                className="flex items-center justify-center gap-2 bg-red-500/90 text-white py-2 px-4 rounded hover:bg-red-600 transition shadow"
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
                className="flex items-center justify-center gap-2 bg-blue-600/90 text-white py-2 px-4 rounded hover:bg-blue-700 transition shadow"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/b/b8/2021_Facebook_icon.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Facebook
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
