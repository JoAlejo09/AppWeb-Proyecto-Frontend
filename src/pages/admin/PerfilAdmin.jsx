import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import storeAuth from "../../context/storeAuth.jsx";
import { toast } from "react-toastify";

const PerfilAdmin = () => {
  const { token } = storeAuth();
  const [cargando, setCargando] = useState(true);

  const [avatarUrl, setAvatarUrl] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    const cargaPerfil = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/admin/perfil`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Cargar valores
        setValue("nombre", data.nombre || "");
        setValue("apellido", data.apellido || "");
        setValue("email", data.email || "");
        setValue("telefono", data.telefono || "");

        const foto = data.imagen || data.imagenIA || "/avatar-placeholder.jpg";
        setAvatarUrl(foto);

        setCargando(false);
      } catch (error) {
        console.error(error);
        toast.error("Error al cargar el perfil");
        setCargando(false);
      }
    };
    if (token) cargaPerfil();
  }, [token, setValue]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const onSubmit = async (formData) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/admin/perfil`;

      if (file) {
        const fd = new FormData();
        fd.append("nombre", formData.nombre || "");
        fd.append("apellido", formData.apellido || "");
        fd.append("telefono", formData.telefono || "");
        fd.append("imagen", file);

        const { data } = await axios.put(url, fd, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });

        toast.success(data.msg || "Perfil actualizado correctamente");
        if (data?.usuario?.imagen) setAvatarUrl(data.usuario.imagen);
        setFile(null);
        setPreview("");
      } else {
        const payload = {
          nombre: formData.nombre || "",
          apellido: formData.apellido || "",
          telefono: formData.telefono || "",
        };

        const { data } = await axios.put(url, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        toast.success(data.msg || "Perfil actualizado correctamente");
      }
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.msg || "No se pudo actualizar el perfil";
      toast.error(msg);
    }
  };

  if (cargando) return <p className="p-4">Cargando perfil...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Perfil del Administrador</h1>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={preview || avatarUrl}
          alt="Avatar"
          className="w-24 h-24 rounded-full object-cover border"
        />
        <div>
          <label className="block text-sm font-semibold mb-1">Cambiar foto</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-600"
          />
          {preview && <small className="text-gray-500">Previsualización lista</small>}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-4 rounded border">
        <div>
          <label className="block text-sm font-semibold mb-1">Nombre:</label>
          <input {...register("nombre")} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Apellido:</label>
          <input {...register("apellido")} className="w-full border px-2 py-1 rounded" />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Correo electrónico:</label>
          <input
            {...register("email")}
            type="email"
            className="w-full border px-2 py-1 rounded bg-gray-100"
            disabled
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Teléfono:</label>
          <input
            {...register("telefono")}
            type="text"
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <button type="submit" className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700">
          Guardar cambios
        </button>
      </form>
    </div>
  );
};

export default PerfilAdmin;
