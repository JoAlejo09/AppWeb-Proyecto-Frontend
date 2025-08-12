import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const CambiarPasswordPaciente = () => {
  const { register, handleSubmit, reset } = useForm();
  const token = localStorage.getItem("token")?.replaceAll('"','');
  const usuario = JSON.parse(localStorage.getItem("usuario") || "{}");

  const onSubmit = async (formData) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/actualizar-password/${usuario._id}`;
      const { data } = await axios.put(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.msg || "Contraseña actualizada");
      reset();
    } catch (error) {
      toast.error(error.response?.data?.msg || "No se pudo actualizar");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-5">
      <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <label className="block text-sm">Contraseña Anterior</label>
          <input
            type="password"
            {...register("passwordAnterior", { required: true })}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm">Contraseña Nueva</label>
          <input
            type="password"
            {...register("passwordNuevo", { required: true, minLength: 6 })}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <button className="bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default CambiarPasswordPaciente;
