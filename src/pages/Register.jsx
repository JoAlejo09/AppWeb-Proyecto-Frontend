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
  const [preview, setPreview] = useState(null);          // Preview común (archivo o IA)
  const [generando, setGenerando] = useState(false);
  const navigate = useNavigate();

  const archivoImagen = watch("imagenArchivo");
  const promptIA = watch("prompt");

  // Manejar vista previa cuando el usuario selecciona un archivo
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

      // Si el usuario elige archivo, limpiamos la IA
      setValue("prompt", "");
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [archivoImagen, setError, clearErrors, setValue]);

  const generarImagenIA = async () => {
    if (!promptIA || promptIA.trim() === "") {
      return toast.error("Debes escribir un prompt para generar la imagen.");
    }
    if (archivoImagen?.length > 0) {
      return toast.error("Ya has seleccionado una imagen. Quita el archivo si deseas usar IA.");
    }
    setGenerando(true);
    try {
      const blob = await generateAvatar(promptIA.trim());
      if (!blob || !blob.type?.startsWith("image/")) {
        toast.error("La IA no devolvió una imagen válida, intenta de nuevo.");
        return;
      }
      const base64 = await convertBlobToBase64(blob);
      setPreview(base64);
      // guardamos en el form para enviar luego como imagenIA
      setValue("imagenIA", base64);
      toast.success("Imagen generada con éxito");
    } catch (error) {
      console.error("Error generando imagen IA:", error);
      toast.error("No se pudo generar la imagen. Intenta en 1 minuto.");
    } finally {
      setGenerando(false);
    }
  };

  const registrarUsuario = async (datos) => {
    try {
      // Validación extra: si no hay archivo y no hay IA, opcionalmente puedes requerir uno
      // if (!datos.imagenArchivo?.length && !datos.imagenIA) {
      //   return toast.error("Debes subir una imagen o generar una con IA");
      // }

      const formData = new FormData();
      formData.append("nombre", datos.nombre);
      formData.append("apellido", datos.apellido);
      formData.append("telefono", datos.telefono);
      formData.append("email", datos.email);
      formData.append("password", datos.password);

      // Si el usuario subió un archivo (clave esperada por el backend: "imagen")
      if (datos.imagenArchivo && datos.imagenArchivo.length > 0) {
        formData.append("imagen", datos.imagenArchivo[0]);
      }
      // Si generó una IA (clave esperada por el backend: "imagenIA" en base64)
      else if (datos.imagenIA) {
        formData.append("imagenIA", datos.imagenIA);
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/usuarios/registrar`,
        formData
      );

      toast.success("Usuario registrado. Revisa tu correo para activar la cuenta");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      const msg = error?.response?.data?.msg || "Hubo un error al registrar el usuario";
      toast.error(msg);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row min-h-screen">
      <ToastContainer />
      {/* Columna izquierda: Formulario */}
      <div className="w-full sm:w-1/2 min-h-screen bg-white flex justify-center items-center px-6">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-700">
            Crea tu cuenta
          </h1>
          <small className="text-gray-500 block my-4 text-sm text-center">
            Completa tus datos para registrarte
          </small>

          <form onSubmit={handleSubmit(registrarUsuario)}>
            {/* Nombre */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Nombre</label>
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
                className="block w-full rounded-md border border-gray-300 px-2 py-1"
              />
              {errors.nombre && <p className="text-red-600 text-sm">{errors.nombre.message}</p>}
            </div>

            {/* Apellido */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Apellido</label>
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
                className="block w-full rounded-md border border-gray-300 px-2 py-1"
              />
              {errors.apellido && <p className="text-red-600 text-sm">{errors.apellido.message}</p>}
            </div>

            {/* Teléfono */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Teléfono (fijo o celular)</label>
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
                className="block w-full rounded-md border border-gray-300 px-2 py-1"
              />
              {errors.telefono && <p className="text-red-600 text-sm">{errors.telefono.message}</p>}
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Correo electrónico</label>
              <input
                type="email"
                {...register("email", {
                  required: "El correo es obligatorio",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Formato de correo inválido",
                  },
                })}
                className="block w-full rounded-md border border-gray-300 px-2 py-1"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="mb-3 relative">
              <label className="block text-sm font-semibold mb-1">Contraseña</label>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "La contraseña es obligatoria",
                  minLength: {
                    value: 6,
                    message: "Mínimo 6 caracteres",
                  },
                })}
                className="block w-full rounded-md border border-gray-300 px-2 py-1 pr-10"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute top-7 right-3 text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Seleccionar archivo */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">Foto de perfil (opcional)</label>
              <input
                type="file"
                accept="image/*"
                {...register("imagenArchivo")}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-white file:text-gray-700 hover:file:bg-gray-100"
              />
            </div>

            {/* IA */}
            <div className="mb-3">
              <label className="block text-sm font-semibold mb-1">O generar avatar con IA</label>
              <input
                type="text"
                {...register("prompt")}
                placeholder="Ej: gato astronauta"
                className="block w-full rounded-md border border-gray-300 px-2 py-1"
                disabled={archivoImagen?.length > 0} // Deshabilita si ya hay archivo
              />
              {/* Campo oculto para enviar base64 al backend, solo si se genera IA */}
              <input type="hidden" {...register("imagenIA")} />
              {!archivoImagen?.length && (
                <button
                  type="button"
                  onClick={generarImagenIA}
                  className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition mt-2 ${
                    generando ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                  disabled={generando}
                >
                  {generando ? "Generando..." : "Generar imagen con IA"}
                </button>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1">Vista previa:</label>
                <img
                  src={preview}
                  alt="Vista previa"
                  className="rounded-md w-32 h-32 object-cover border"
                />
              </div>
            )}

            {/* Botón */}
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

          {/* Registro social (opcional) */}
          <div className="mt-6">
            <p className="text-center text-gray-500 text-sm mb-2">O registrarse con:</p>
            <div className="flex flex-col gap-3">
              <a
                href={`${import.meta.env.VITE_BACKEND_URL}/auth/google`}
                className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
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
                className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
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

      {/* Columna derecha: Imagen */}
      <div className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/freemp.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"></div>
    </div>
  );
}
