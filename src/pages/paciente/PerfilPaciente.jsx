import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PerfilPaciente = () => {
  const [cargando, setCargando] = useState(true);
  const [preview, setPreview] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [usuarioId, setUsuarioId] = useState(null);

  // IMPORTANTE: guarda el token sin comillas al setearlo
  const token = localStorage.getItem("token")?.replaceAll('"', '');

  const { register, handleSubmit, setValue, watch } = useForm();
  const imagenArchivo = watch("imagenArchivo");

  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ⚠️ El backend devuelve id, no _id
        setUsuarioId(data.id);

        setValue("nombre", data.nombre || "");
        setValue("apellido", data.apellido || "");
        setValue("email", data.email || "");
        setValue("telefono", data.telefono || "");

        // Opción A (si tu backend agrega imagen/imagenIA):
        if (data.imagen || data.imagenIA) {
          setAvatarUrl(data.imagen || data.imagenIA);
        } else {
          // Opción B: placeholder si no devuelves imagen
          setAvatarUrl("/avatar-placeholder.jpg");
        }
        setCargando(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el perfil");
        setCargando(false);
      }
    })();
  }, [token, setValue]);

  // vista previa de archivo local
  useEffect(() => {
    const file = imagenArchivo?.[0];
    if (!file) return setPreview(null);
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [imagenArchivo]);

  const onSubmit = async (formData) => {
    try {
      if (!usuarioId) {
        toast.error("No se pudo detectar el ID del paciente");
        return;
      }
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil/${usuarioId}`;

      // Enviar data como FormData si hay archivo
      const payload = new FormData();
      payload.append("nombre", formData.nombre || "");
      payload.append("apellido", formData.apellido || "");
      payload.append("telefono", formData.telefono || "");
      // el email no debería cambiar aquí (normalmente)
      payload.append("email", formData.email || "");

      if (formData.imagenArchivo?.length) {
        // ⚠️ Asegúrate que el backend lea 'imagen' (req.files.imagen)
        payload.append("imagen", formData.imagenArchivo[0]);
      }

      const { data } = await axios.put(url, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Actualiza avatar si backend devuelve imagen actualizada
      if (data?.usuario?.imagen || data?.usuario?.imagenIA) {
        setAvatarUrl(data.usuario.imagen || data.usuario.imagenIA);
      }

      toast.success(data.msg || "Perfil actualizado");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo actualizar");
    }
  };

  if (cargando) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded shadow p-6">
      <h2 className="text-2xl font-bold mb-6">Mi Perfil</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border">
          {preview ? (
            <img src={preview} alt="preview" className="w-full h-full object-cover" />
          ) : (
            <img src={avatarUrl || "/avatar-placeholder.jpg"} alt="avatar" className="w-full h-full object-cover" />
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
          <p className="text-xs text-gray-500 mt-1">La imagen se sube a Cloudinary.</p>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold">Nombre</label>
          <input {...register("nombre")} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold">Apellido</label>
          <input {...register("apellido")} className="w-full border rounded px-3 py-2" />
        </div>

        <div>
          <label className="block text-sm font-semibold">Correo</label>
          <input {...register("email")} type="email" className="w-full border rounded px-3 py-2 bg-gray-100" disabled />
        </div>

        <div>
          <label className="block text-sm font-semibold">Teléfono</label>
          <input {...register("telefono")} className="w-full border rounded px-3 py-2" />
        </div>

        <button className="bg-teal-600 hover:bg-teal-700 text-white rounded px-6 py-2">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default PerfilPaciente;
