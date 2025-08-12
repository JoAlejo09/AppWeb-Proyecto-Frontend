// src/pages/paciente/PerfilPaciente.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const PerfilPaciente = () => {
  const [cargando, setCargando] = useState(true);
  const [pacienteId, setPacienteId] = useState(null);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, setValue, watch } = useForm();
  const imagenArchivo = watch("imagenArchivo");

  useEffect(() => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (!token) {
      toast.error("No hay token, inicia sesión nuevamente");
      return;
    }

    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // OJO: si tu backend envía _id en vez de id, cámbialo por data._id
        setPacienteId(data.id || data._id);

        setValue("nombre", data.nombre || "");
        setValue("apellido", data.apellido || "");
        setValue("email", data.email || "");
        setValue("telefono", data.telefono || "");

        const foto = data.imagen || data.imagenIA || "/avatar-placeholder.jpg";
        setAvatarUrl(foto);

        setCargando(false);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.msg || "Error al cargar el perfil");
        setCargando(false);
      }
    })();
  }, [setValue]);

  // Preview de la imagen local
  useEffect(() => {
    const f = imagenArchivo?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(f);
  }, [imagenArchivo]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (formData) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (!token) {
      toast.error("No hay token, inicia sesión nuevamente");
      return;
    }
    if (!pacienteId) {
      toast.error("No se detectó el ID del paciente");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil/${pacienteId}`;

      // Si hay archivo, usar multipart/form-data
      if (file || formData.imagenArchivo?.[0]) {
        const fd = new FormData();
        fd.append("nombre", formData.nombre || "");
        fd.append("apellido", formData.apellido || "");
        fd.append("telefono", formData.telefono || "");
        // email normalmente lo dejas inmutable:
        fd.append("email", formData.email || "");

        // el campo en backend debe ser req.files.imagen
        fd.append("imagen", file || formData.imagenArchivo[0]);

        const { data } = await axios.put(url, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(data.msg || "Perfil actualizado");

        // Si backend devuelve la nueva url de imagen:
        if (data?.usuario?.imagen || data?.usuario?.imagenIA) {
          setAvatarUrl(data.usuario.imagen || data.usuario.imagenIA);
          setPreview("");
          setFile(null);
        }
      } else {
        // Sin archivo → JSON
        const payload = {
          nombre: formData.nombre || "",
          apellido: formData.apellido || "",
          telefono: formData.telefono || "",
          email: formData.email || "",
        };

        const { data } = await axios.put(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(data.msg || "Perfil actualizado");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo actualizar");
    }
  };

  if (cargando) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto bg-white rounded shadow p-5">
      <h2 className="text-xl font-bold mb-4">Mi Perfil</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full overflow-hidden border">
            <img
              src={preview || avatarUrl}
              alt="avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Cambiar foto</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              {...register("imagenArchivo")}
              className="block w-full text-sm"
            />
            {preview && <small className="text-gray-500">Previsualización lista</small>}
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
          <input
            {...register("email")}
            type="email"
            className="w-full border px-2 py-1 rounded bg-gray-100"
            disabled
          />
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
