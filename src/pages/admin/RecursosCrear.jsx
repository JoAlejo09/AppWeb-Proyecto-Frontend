import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx";
import { useNavigate } from "react-router-dom";

/**
 * Página para crear un nuevo recurso (cuestionario o contenido).
 * Envia a POST /admin/recurso/crear con { tipo, titulo, descripcion, datos }
 */
const RecursosCrear = () => {
  const { token } = storeAuth();
  const navigate = useNavigate();

  const BASE = `${import.meta.env.VITE_BACKEND_URL}/admin`;

  // Campos base
  const [tipo, setTipo] = useState("contenido"); // "contenido" | "cuestionario"
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // Datos si el recurso es "contenido"
  const [contenido, setContenido] = useState({
    url: "",
    tipo: "video", // 'video' | 'articulo' | 'guia'
    fuente: ""
  });

  // Datos si el recurso es "cuestionario"
  const [preguntas, setPreguntas] = useState([
    { texto: "", opciones: [""], tipoRespuesta: "opcion" }
  ]);

  const [enviando, setEnviando] = useState(false);

  // --- Helpers para cuestionario ---
  const handleAddPregunta = () => {
    setPreguntas(prev => [
      ...prev,
      { texto: "", opciones: [""], tipoRespuesta: "opcion" }
    ]);
  };

  const handleDeletePregunta = (idx) => {
    const copy = [...preguntas];
    copy.splice(idx, 1);
    setPreguntas(copy);
  };

  const handleChangePregunta = (idx, field, value) => {
    const copy = [...preguntas];
    copy[idx][field] = value;
    // Si cambia a "abierta", limpia opciones
    if (field === "tipoRespuesta" && value === "abierta") {
      copy[idx].opciones = [];
    }
    // Si cambia de "abierta" a "opcion", agrega una opción vacía
    if (field === "tipoRespuesta" && value === "opcion" && (!copy[idx].opciones || copy[idx].opciones.length === 0)) {
      copy[idx].opciones = [""];
    }
    setPreguntas(copy);
  };

  const handleAddOpcion = (idx) => {
    const copy = [...preguntas];
    copy[idx].opciones = [...(copy[idx].opciones || []), ""];
    setPreguntas(copy);
  };

  const handleChangeOpcion = (idx, oidx, value) => {
    const copy = [...preguntas];
    copy[idx].opciones[oidx] = value;
    setPreguntas(copy);
  };

  const handleRemoveOpcion = (idx, oidx) => {
    const copy = [...preguntas];
    copy[idx].opciones.splice(oidx, 1);
    setPreguntas(copy);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones mínimas
    if (!titulo.trim()) {
      return toast.error("El título es obligatorio");
    }
    if (tipo === "contenido") {
      if (!contenido.url.trim()) return toast.error("La URL es obligatoria");
    } else {
      if (preguntas.length === 0) return toast.error("Agrega al menos una pregunta");
      for (const p of preguntas) {
        if (!p.texto.trim()) return toast.error("Todas las preguntas deben tener texto");
        if (p.tipoRespuesta === "opcion") {
          const hasValidOption = p.opciones.some(op => op && op.trim().length > 0);
          if (!hasValidOption) return toast.error("Cada pregunta de opción múltiple debe tener al menos una opción");
        }
      }
    }

    const payload = {
      tipo,
      titulo,
      descripcion,
      datos:
        tipo === "contenido"
          ? {
              url: contenido.url.trim(),
              tipo: contenido.tipo,
              fuente: contenido.fuente.trim(),
            }
          : {
              preguntas: preguntas.map(p => ({
                texto: p.texto.trim(),
                tipoRespuesta: p.tipoRespuesta,
                opciones: p.tipoRespuesta === "opcion"
                  ? (p.opciones || []).map(op => op.trim()).filter(Boolean)
                  : []
              })),
            },
    };

    try {
      setEnviando(true);
      const { data } = await axios.post(`${BASE}/recurso/crear`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data.msg || "Recurso creado correctamente");
      // Redirigir a listado
      navigate("/admin/recursos");
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.msg || "Error al crear el recurso";
      toast.error(msg);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Crear Recurso</h2>
        <button
          onClick={() => navigate("/admin/recursos/listar")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          ← Volver al listado
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border rounded p-6 shadow-sm">
        {/* Tipo */}
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo"
              value="contenido"
              checked={tipo === "contenido"}
              onChange={() => setTipo("contenido")}
            />
            <span>Contenido</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="tipo"
              value="cuestionario"
              checked={tipo === "cuestionario"}
              onChange={() => setTipo("cuestionario")}
            />
            <span>Cuestionario</span>
          </label>
        </div>

        {/* Campos base */}
        <div>
          <label className="block text-sm font-semibold">Título</label>
          <input
            value={titulo}
            onChange={e => setTitulo(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Ej. Técnicas para la ansiedad"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Descripción</label>
          <textarea
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Descripción breve del recurso"
          />
        </div>

        {/* Si CONTENIDO */}
        {tipo === "contenido" && (
          <div className="space-y-4 border-t pt-4">
            <h3 className="font-semibold text-lg">Datos de contenido</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm">URL</label>
                <input
                  value={contenido.url}
                  onChange={(e) => setContenido({ ...contenido, url: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-sm">Tipo</label>
                <select
                  value={contenido.tipo}
                  onChange={(e) => setContenido({ ...contenido, tipo: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="video">Video</option>
                  <option value="articulo">Artículo</option>
                  <option value="guia">Guía</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm">Fuente</label>
              <input
                value={contenido.fuente}
                onChange={(e) => setContenido({ ...contenido, fuente: e.target.value })}
                className="w-full border rounded px-3 py-2"
                placeholder="Ej. OMS, Ministerio de Salud..."
              />
            </div>
          </div>
        )}

        {/* Si CUESTIONARIO */}
        {tipo === "cuestionario" && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Preguntas del cuestionario</h3>
              <button
                type="button"
                onClick={handleAddPregunta}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                + Añadir pregunta
              </button>
            </div>

            {preguntas.length === 0 && (
              <p className="text-sm text-gray-500">Aún no has agregado preguntas…</p>
            )}

            {preguntas.map((p, idx) => (
              <div key={idx} className="border rounded p-4 bg-gray-50 space-y-3">
                <div className="flex justify-between items-center">
                  <strong>Pregunta {idx + 1}</strong>
                  <button
                    type="button"
                    onClick={() => handleDeletePregunta(idx)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>

                <div>
                  <label className="block text-sm">Texto de la pregunta</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={p.texto}
                    onChange={(e) => handleChangePregunta(idx, "texto", e.target.value)}
                    placeholder="Ej. ¿Con qué frecuencia te sientes ansioso?"
                  />
                </div>

                <div>
                  <label className="block text-sm">Tipo de respuesta</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={p.tipoRespuesta}
                    onChange={(e) => handleChangePregunta(idx, "tipoRespuesta", e.target.value)}
                  >
                    <option value="opcion">Opción múltiple</option>
                    <option value="abierta">Abierta</option>
                  </select>
                </div>

                {p.tipoRespuesta === "opcion" && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm">Opciones</label>
                      <button
                        type="button"
                        onClick={() => handleAddOpcion(idx)}
                        className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        + Opción
                      </button>
                    </div>
                    {(p.opciones || []).map((op, oidx) => (
                      <div key={oidx} className="flex gap-2">
                        <input
                          className="flex-1 border rounded px-3 py-2"
                          value={op}
                          onChange={(e) => handleChangeOpcion(idx, oidx, e.target.value)}
                          placeholder={`Opción ${oidx + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOpcion(idx, oidx)}
                          className="px-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate("/admin/recursos")}
            className="px-4 py-2 border rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={enviando}
            className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {enviando ? "Guardando..." : "Crear recurso"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecursosCrear;
