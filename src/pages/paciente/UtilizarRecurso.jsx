// src/pages/paciente/UtilizarRecurso.jsx
import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import storeAuth from "../../context/storeAuth.jsx";
import { toast } from "react-toastify";

const UtilizarRecurso = () => {
  const { token } = storeAuth();
  const [recursos, setRecursos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [recursoSeleccionado, setRecursoSeleccionado] = useState(null);
  const [detalle, setDetalle] = useState(null); // recurso con populate para modal
  const [respuestas, setRespuestas] = useState({}); // { [preguntaId]: valor }

  // 1) Cargar recursos para el paciente
  useEffect(() => {
    const loadRecursos = async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/recurso/lista`; 
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRecursos(data || []);
      } catch (error) {
        console.error(error);
        toast.error("No se pudo cargar recursos");
      } finally {
        setCargando(false);
      }
    };
    loadRecursos();
  }, [token]);

  const recursosFiltrados = useMemo(() => {
    if (filtroTipo === "todos") return recursos;
    return recursos.filter(r => r.tipo === filtroTipo);
  }, [recursos, filtroTipo]);

  // 2) Abrir modal (cargar detalle, con populate de referencia)
  const abrirModal = async (recurso) => {
    try {
      setRecursoSeleccionado(recurso);
      setRespuestas({});
      setDetalle(null);

      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientesrecurso/${recurso._id}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDetalle(data);
    } catch (error) {
      console.error(error);
      toast.error("No se pudo cargar el recurso");
    }
  };

  const cerrarModal = () => {
    setRecursoSeleccionado(null);
    setDetalle(null);
    setRespuestas({});
  };

  // 3) Marcar contenido como visto
  const marcarVisto = async () => {
    if (!recursoSeleccionado) return;
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/recurso/utilizar`;
      const payload = {
        recursoId: recursoSeleccionado._id,
        tipo: "contenido"
      };
      const { data } = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data?.msg || "Contenido marcado como visto");
      cerrarModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo marcar como visto");
    }
  };

  // 4) Enviar cuestionario
  const enviarCuestionario = async () => {
    if (!recursoSeleccionado || !detalle) return;

    const cuestionarioId = detalle.referencia?._id;
    const preguntas = detalle.referencia?.preguntas || [];
    const respuestasArray = preguntas.map(p => ({
      preguntaId: p._id,
      respuesta: respuestas[p._id] || ""
    }));

    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/recurso/utilizar`;
      const payload = {
        recursoId: recursoSeleccionado._id,
        tipo: "cuestionario",
        respuestas: respuestasArray
      };
      const { data } = await axios.post(url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(data?.msg || "Cuestionario enviado");
      cerrarModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.msg || "No se pudo enviar el cuestionario");
    }
  };

  // Render de contenido según tipo
  const renderContenido = () => {
    if (!detalle || detalle.tipo !== "contenido") return null;
    const cont = detalle.referencia; // { url, tipo, fuente }

    return (
      <div className="space-y-3">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Tipo: </span> {cont?.tipo}
        </p>
        {cont?.tipo === "video" ? (
          cont.url?.includes("youtube") ? (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                className="w-full h-64"
                src={cont.url.replace("watch?v=", "embed/")}
                title="Video"
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <video controls className="w-full rounded">
              <source src={cont.url} type="video/mp4" />
              Tu navegador no soporta video HTML5.
            </video>
          )
        ) : (
          <a href={cont.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            Abrir contenido
          </a>
        )}

        {cont?.fuente && <p className="text-xs text-gray-500">Fuente: {cont.fuente}</p>}

        <button
          onClick={marcarVisto}
          className="mt-3 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
        >
          Marcar como visto
        </button>
      </div>
    );
  };

  const renderCuestionario = () => {
    if (!detalle || detalle.tipo !== "cuestionario") return null;
    const preguntas = detalle.referencia?.preguntas || [];

    const handleChange = (preguntaId, value) => {
      setRespuestas(prev => ({ ...prev, [preguntaId]: value }));
    };

    return (
      <div className="space-y-4">
        {preguntas.map((p) => (
          <div key={p._id} className="border-b pb-3">
            <p className="font-medium mb-2">{p.texto}</p>

            {p.tipoRespuesta === "opcion" && Array.isArray(p.opciones) ? (
              <div className="space-y-1">
                {p.opciones.map((op, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`pregunta-${p._id}`}
                      value={op}
                      onChange={(e) => handleChange(p._id, e.target.value)}
                    />
                    <span>{op}</span>
                  </label>
                ))}
              </div>
            ) : (
              <textarea
                className="w-full border rounded p-2"
                placeholder="Escribe tu respuesta..."
                onChange={(e) => handleChange(p._id, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          onClick={enviarCuestionario}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
        >
          Enviar respuestas
        </button>
      </div>
    );
  };

  if (cargando) return <p className="p-4">Cargando recursos...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Utilizar Recursos</h1>

      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm">Filtrar por tipo:</label>
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="todos">Todos</option>
          <option value="contenido">Contenido</option>
          <option value="cuestionario">Cuestionario</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Título</th>
              <th className="p-3">Descripción</th>
              <th className="p-3">Tipo</th>
              <th className="p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {recursosFiltrados.map((r) => (
              <tr key={r._id} className="border-b">
                <td className="p-3">{r.titulo}</td>
                <td className="p-3">{r.descripcion}</td>
                <td className="p-3 capitalize">{r.tipo}</td>
                <td className="p-3">
                  <button
                    onClick={() => abrirModal(r)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                  >
                    Usar recurso
                  </button>
                </td>
              </tr>
            ))}

            {recursosFiltrados.length === 0 && (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No hay recursos para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {recursoSeleccionado && detalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl shadow-lg relative">
            <button
              onClick={cerrarModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-semibold mb-2">{detalle.titulo}</h2>
            <p className="text-sm text-gray-600 mb-4">{detalle.descripcion}</p>

            {detalle.tipo === "contenido" ? renderContenido() : renderCuestionario()}
          </div>
        </div>
      )}
    </div>
  );
};

export default UtilizarRecurso;
