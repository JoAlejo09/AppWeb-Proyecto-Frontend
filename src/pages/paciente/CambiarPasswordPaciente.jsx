// src/pages/paciente/CambiarPasswordPaciente.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx"; // <-- tu store Zustand

const CambiarPasswordPaciente = () => {
  const { token } = storeAuth();              // 👈 usamos el token desde Zustand
  const [pacienteId, setPacienteId] = useState(null);
  const [cargando, setCargando] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  // (Opcional) Verificar contraseñas iguales
  const passAnterior = watch("passwordAnterior");
  const passNueva = watch("passwordNuevo");

  // 1) Traer el ID del paciente con el token
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!token) {
        toast.error("No hay token de autenticación. Inicia sesión nuevamente.");
        setCargando(false);
        return;
      }
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // el backend puede retornar `id` o `_id`
        setPacienteId(data.id || data._id);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.msg || "No se pudo obtener el perfil");
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, [token]);

  // 2) Enviar el cambio de password
  const onSubmit = async (formData) => {
    if (!token) return toast.error("No hay token, vuelve a iniciar sesión.");
    if (!pacienteId) return toast.error("No se pudo detectar tu ID de usuario.");

    // Validaciones extra
    if (formData.passwordAnterior === formData.passwordNuevo) {
      return toast.error("La nueva contraseña no puede ser igual a la anterior.");
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/actualizar-password/${pacienteId}`;
      const { data } = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(data.msg || "Contraseña actualizada correctamente");
      reset();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo actualizar la contraseña");
    }
  };

  if (cargando) {
    return <p className="p-4">Cargando...</p>;
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-5">
      <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <label className="block text-sm font-semibold mb-1">
            Contraseña Anterior
          </label>
          <input
            type="password"
            {...register("passwordAnterior", { required: "Campo obligatorio" })}
            className="w-full border px-2 py-1 rounded"
          />
          {errors.passwordAnterior && (
            <p className="text-red-600 text-sm">{errors.passwordAnterior.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">
            Contraseña Nueva
          </label>
          <input
            type="password"
            {...register("passwordNuevo", {
              required: "Campo obligatorio",
              minLength: { value: 6, message: "Debe tener al menos 6 caracteres" },
            })}
            className="w-full border px-2 py-1 rounded"
          />
          {errors.passwordNuevo && (
            <p className="text-red-600 text-sm">{errors.passwordNuevo.message}</p>
          )}
          {passAnterior && passNueva && passAnterior === passNueva && (
            <p className="text-yellow-600 text-sm mt-1">
              La nueva contraseña no debería ser igual a la anterior.
            </p>
          )}
        </div>

        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2"
        >
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CambiarPasswordPaciente;
