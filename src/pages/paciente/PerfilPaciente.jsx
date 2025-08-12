// src/pages/paciente/PerfilPaciente.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx"; // <- tu store Zustand

const PerfilPaciente = () => {
  // Traemos el token y el setter del nombre desde el store
  const { token, nombre: nombreStore, setNombre } = storeAuth();

  const [cargando, setCargando] = useState(true);
  const [pacienteId, setPacienteId] = useState(null);

  // Para avatar
  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState(null);      // archivo seleccionado
  const [preview, setPreview] = useState("");  // preview local

  const { register, handleSubmit, setValue, watch } = useForm();
  const imagenArchivo = watch("imagenArchivo");

  useEffect(() => {
    if (!token) {
      toast.error("No hay token, inicia sesión nuevamente.");
      return;
    }

    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // OJO: usa data.id si tu backend lo manda así, sino data._id
        setPacienteId(data.id || data._id);

        // Seteamos los campos del formulario
        setValue("nombre", data.nombre || "");
        setValue("apellido", data.apellido || "");
        setValue("email", data.email || "");
        setValue("telefono", data.telefono || "");

        // Foto: primero Cloudinary, luego IA, o placeholder
        const foto = data.imagen || data.imagenIA || "/avatar-placeholder.jpg";
        setAvatarUrl(foto);

        // sincronizamos el nombre con el store (opcional)
        if (data.nombre) setNombre(data.nombre);

        setCargando(false);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.msg || "Error al cargar el perfil");
        setCargando(false);
      }
    })();
  }, [token, setValue, setNombre]);

  // Preview de archivo seleccionado con react-hook-form
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
    if (!token) {
      toast.error("No hay token, inicia sesión nuevamente.");
      return;
    }
    if (!pacienteId) {
      toast.error("No se detectó el ID del paciente");
      return;
    }

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil/${pacienteId}`;

      // Si hay archivo, usamos multipart/form-data
      if (file || formData.imagenArchivo?.[0]) {
        const fd = new FormData();
        fd.append("nombre", formData.nombre || "");
        fd.append("apellido", formData.apellido || "");
        fd.append("telefono", formData.telefono || "");
        // email normalmente NO se cambia, pero si tu backend lo permite:
        fd.append("email", formData.email || "");

        // campo 'imagen' debe coincidir con req.files.imagen en el backend
        fd.append("imagen", file || formData.imagenArchivo[0]);

        const { data } = await axios.put(url, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(data.msg || "Perfil actualizado");

        // si el backend devuelve la nueva url, refrescamos
        const nueva = data?.usuario?.imagen || data?.usuario?.imagenIA;
        if (nueva) {
          setAvatarUrl(nueva);
          setPreview("");
          setFile(null);
        }

        // sincroniza nombre en el store
        if (data?.usuario?.nombre) setNombre(data.usuario.nombre);

      } else {
        // Sin archivo -> JSON normal
        const payload = {
          nombre: formData.nombre || "",
          apellido: formData.apellido || "",
          telefono: formData.telefono || "",
          // email sólo si lo vas a permitir cambiar
          email: formData.email || "",
        };

        const { data } = await axios.put(url, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        toast.success(data.msg || "Perfil actualizado");
        if (data?.usuario?.nombre) setNombre(data.usuario.nombre);
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
            {preview && (
              <small className="text-gray-500">Previsualización lista</small>
            )}
          </div>
        </div>

        {/* Datos */}
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
