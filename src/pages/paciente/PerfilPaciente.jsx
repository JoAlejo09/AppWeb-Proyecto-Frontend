import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PerfilPaciente = () => {
  const [cargando, setCargando] = useState(true);
  const [preview, setPreview] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  const token = localStorage.getItem("token")?.replaceAll('"','');
  const { register, handleSubmit, setValue, watch } = useForm();

  const imagenArchivo = watch("imagenArchivo");

  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsuarioId(data._id);
        setValue("nombre", data.nombre || "");
        setValue("apellido", data.apellido || "");
        setValue("email", data.email || "");
        setValue("telefono", data.telefono || "");
        if (data.imagen) setPreview(data.imagen);
        setCargando(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el perfil");
      }
    })();
  }, [token, setValue]);

  // vista previa archivo
  useEffect(() => {
    const file = imagenArchivo?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  }, [imagenArchivo]);

  const onSubmit = async (formData) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil/${usuarioId}`;

      // Si envías imagen, usa FormData
      const payload = new FormData();
      Object.keys(formData).forEach((k) => {
        if (k === "imagenArchivo" && formData[k]?.length) {
          payload.append("imagen", formData[k][0]); // el backend espera 'imagen'
        } else {
          payload.append(k, formData[k]);
        }
      });

      const { data } = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(data.msg || "Perfil actualizado");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo actualizar");
    }
  };

  if (cargando) return <p>Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-5">
      <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden">
            {preview ? (
              <img src={preview} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Sin imagen
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cambiar foto</label>
            <input
              type="file"
              accept="image/*"
              {...register("imagenArchivo")}
              className="block w-full text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Se actualizará en Cloudinary</p>
          </div>
        </div>

        <div>
          <label className="block text-sm">Nombre</label>
          <input {...register("nombre")} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm">Apellido</label>
          <input {...register("apellido")} className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm">Correo</label>
          <input {...register("email")} type="email" className="w-full border px-2 py-1 rounded" />
        </div>
        <div>
          <label className="block text-sm">Teléfono</label>
          <input {...register("telefono")} className="w-full border px-2 py-1 rounded" />
        </div>

        <button className="bg-teal-600 hover:bg-teal-700 text-white rounded px-4 py-2">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default PerfilPaciente;
