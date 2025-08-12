import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx";

const CambiarPassword = () => {
  const { token } = storeAuth();
  const [adminId, setAdminId] = useState(null);
  const [cargando, setCargando] = useState(true);

  // Toggles para ver/ocultar password por campo
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Carga el ID del admin desde /admin/perfil
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/admin/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Asegúrate que el backend retorne _id
        const id = data._id || data.id;
        if (!id) {
          toast.error("No se pudo obtener el ID del administrador");
        }
        setAdminId(id);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar datos del perfil");
      } finally {
        setCargando(false);
      }
    };
    if (token) cargarPerfil();
  }, [token]);

  const onSubmit = async ({ passwordAnterior, passwordNuevo, confirmarPassword }) => {
    if (!adminId) {
      return toast.error("No se pudo detectar el ID del admin");
    }
    if (passwordNuevo !== confirmarPassword) {
      return toast.error("La confirmación de contraseña no coincide");
    }

    try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/admin/actualizar-password`;
        const {data} = await axios.put(url, { passwordAnterior, passwordNuevo }, {
              headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success(data?.msg || "Contraseña actualizada correctamente");
      reset();
    } catch (error) {
      const msg = error.response?.data?.msg || "Error al actualizar contraseña";
      toast.error(msg);
      console.error(error);
    }
  };

  if (cargando) {
    return <p className="p-4">Cargando...</p>;
  }

  return (
    <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow p-6 border">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Cambiar Contraseña</h1>
      <p className="text-sm text-gray-500 mb-6">
        Ingresa tu contraseña actual y define una nueva.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        {/* Contraseña anterior */}
        <div>
          <label className="block text-sm font-semibold mb-1">Contraseña anterior</label>
          <div className="relative">
            <input
              type={showOld ? "text" : "password"}
              className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="••••••••"
              {...register("passwordAnterior", {
                required: "La contraseña anterior es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              title={showOld ? "Ocultar" : "Mostrar"}
            >
              {showOld ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.passwordAnterior && (
            <p className="text-red-600 text-xs mt-1">{errors.passwordAnterior.message}</p>
          )}
        </div>

        {/* Nueva contraseña */}
        <div>
          <label className="block text-sm font-semibold mb-1">Nueva contraseña</label>
          <div className="relative">
            <input
              type={showNew ? "text" : "password"}
              className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="••••••••"
              {...register("passwordNuevo", {
                required: "La nueva contraseña es obligatoria",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              title={showNew ? "Ocultar" : "Mostrar"}
            >
              {showNew ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.passwordNuevo && (
            <p className="text-red-600 text-xs mt-1">{errors.passwordNuevo.message}</p>
          )}
        </div>

        {/* Confirmar nueva */}
        <div>
          <label className="block text-sm font-semibold mb-1">Confirmar nueva contraseña</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border rounded px-3 py-2 focus:ring-1 focus:ring-blue-600 focus:outline-none"
              placeholder="••••••••"
              {...register("confirmarPassword", {
                required: "Confirmar contraseña es obligatorio",
                validate: (val) =>
                  val === watch("passwordNuevo") || "Las contraseñas no coinciden",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              title={showConfirm ? "Ocultar" : "Mostrar"}
            >
              {showConfirm ? "🙈" : "👁️"}
            </button>
          </div>
          {errors.confirmarPassword && (
            <p className="text-red-600 text-xs mt-1">{errors.confirmarPassword.message}</p>
          )}
        </div>

        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold"
          type="submit"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default CambiarPassword;
