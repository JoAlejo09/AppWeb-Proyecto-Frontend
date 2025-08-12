import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

/**
 * Props:
 * - token
 * - recurso: { _id, titulo, descripcion, tipo, referencia, tipoRef }
 * - onClose()
 * - onUpdated() -> recarga lista
 */
const EditarRecursoModal = ({ token, recurso, onClose, onUpdated }) => {
  const BASE = `${import.meta.env.VITE_BACKEND_URL}/admin`;

  // campos básicos
  const [titulo, setTitulo] = useState(recurso.titulo || "");
  const [descripcion, setDescripcion] = useState(recurso.descripcion || "");

  // según tipo
  const [contenido, setContenido] = useState({
    url: recurso.tipo === "contenido" ? recurso?.referencia?.url || "" : "",
    tipo: recurso.tipo === "contenido" ? recurso?.referencia?.tipo || "video" : "video",
    fuente: recurso.tipo === "contenido" ? recurso?.referencia?.fuente || "" : "",
  });

  const [cuestionario, setCuestionario] = useState(
    recurso.tipo === "cuestionario"
      ? recurso?.referencia?.preguntas || []
      : []
  );

  useEffect(() => {
    // Si quisieras refrescar datos del backend por id:
    // fetchRecurso()
  }, []);

  const handleAddPregunta = () => {
    setCuestionario(prev => [
      ...prev,
      { texto: "", opciones: [], tipoRespuesta: "opcion" }
    ]);
  };

  const handleChangePregunta = (idx, field, value) => {
    const copy = [...cuestionario];
    copy[idx][field] = value;
    setCuestionario(copy);
  };

  const handleAddOpcion = (idx) => {
    const copy = [...cuestionario];
    copy[idx].opciones = [...(copy[idx].opciones || []), ""];
    setCuestionario(copy);
  };

  const handleChangeOpcion = (idx, oidx, value) => {
    const copy = [...cuestionario];
    copy[idx].opciones[oidx] = value;
    setCuestionario(copy);
  };

  const handleDeletePregunta = (idx) => {
    const copy = [...cuestionario];
    copy.splice(idx, 1);
    setCuestionario(copy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Armamos payload para actualizar
    const payload = {
      titulo,
      descripcion,
      datos:
        recurso.tipo === "contenido"
          ? {
              url: contenido.url,
              tipo: contenido.tipo,
              fuente: contenido.fuente,
            }
          : {
              preguntas: cuestionario.map((p) => ({
                texto: p.texto,
                opciones: p.opciones?.filter(Boolean) || [],
                tipoRespuesta: p.tipoRespuesta || "opcion",
              })),
            },
    };

    try {
      const { data } = await axios.put(
        `${BASE}/recurso/actualizar/${recurso._id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(data.msg || "Recurso actualizado");
      onClose();
      onUpdated(); // recargar lista
    } catch (err) {
      console.error(err);
      toast.error("No se pudo actualizar el recurso");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded shadow w-full max-w-3xl p-6">
        <h2 className="text-lg font-semibold mb-4">
          Editar recurso — <span className="capitalize">{recurso.tipo}</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Campos base */}
          <div>
            <label className="block text-sm font-medium">Título</label>
            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Descripción</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {recurso.tipo === "contenido" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">URL</label>
                  <input
                    value={contenido.url}
                    onChange={(e) => setContenido({ ...contenido, url: e.target.value })}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Tipo</label>
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
                <label className="block text-sm font-medium">Fuente</label>
                <input
                  value={contenido.fuente}
                  onChange={(e) => setContenido({ ...contenido, fuente: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Preguntas</h3>
                <button
                  type="button"
                  onClick={handleAddPregunta}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  + Añadir pregunta
                </button>
              </div>

              {cuestionario.length === 0 && (
                <p className="text-sm text-gray-500">No hay preguntas todavía…</p>
              )}

              {cuestionario.map((p, idx) => (
                <div key={idx} className="border rounded p-3 space-y-2 bg-gray-50">
                  <div className="flex justify-between">
                    <span className="font-medium">Pregunta {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeletePregunta(idx)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div>
                    <label className="block text-sm">Texto</label>
                    <input
                      value={p.texto}
                      onChange={(e) => handleChangePregunta(idx, "texto", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm">Tipo de respuesta</label>
                    <select
                      value={p.tipoRespuesta || "opcion"}
                      onChange={(e) => handleChangePregunta(idx, "tipoRespuesta", e.target.value)}
                      className="w-full border rounded px-2 py-1"
                    >
                      <option value="opcion">Opción múltiple</option>
                      <option value="abierta">Abierta</option>
                    </select>
                  </div>

                  {p.tipoRespuesta !== "abierta" && (
                    <div>
                      <div className="flex justify-between items-center">
                        <label className="block text-sm">Opciones</label>
                        <button
                          type="button"
                          onClick={() => handleAddOpcion(idx)}
                          className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          + Opción
                        </button>
                      </div>
                      <div className="space-y-2 mt-2">
                        {(p.opciones || []).map((op, oidx) => (
                          <input
                            key={oidx}
                            value={op}
                            onChange={(e) => handleChangeOpcion(idx, oidx, e.target.value)}
                            className="w-full border rounded px-2 py-1"
                            placeholder={`Opción ${oidx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarRecursoModal;
