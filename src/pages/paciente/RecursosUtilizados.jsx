import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import storeAuth from "../../context/storeAuth.jsx";

const RecursosUtilizados = () => {
  const { token } = storeAuth();
  const [cargando, setCargando] = useState(true);
  const [reportes, setReportes] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);

  const [filtroTipo, setFiltroTipo] = useState("todos"); // 'todos' | 'contenido' | 'cuestionario'
  const [query, setQuery] = useState("");

  // Modal de detalle
  const [modalOpen, setModalOpen] = useState(false);
  const [detalle, setDetalle] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1) Obtener el ID del paciente desde /pacientes/perfil
        const urlPerfil = `${import.meta.env.VITE_BACKEND_URL}/pacientes/perfil`;
        const perfilResp = await axios.get(urlPerfil, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const id = perfilResp.data?.id || perfilResp.data?._id;
        if (!id) {
          toast.error("No se pudo obtener el ID del paciente.");
          setCargando(false);
          return;
        }
        setPacienteId(id);

        // 2) Obtener reportes del paciente
        // Ajusta si pones este endpoint bajo /admin o /pacientes
        const urlReportes = `${import.meta.env.VITE_BACKEND_URL}/pacientes/reporte/mis-reportes/${id}`;
        const { data } = await axios.get(urlReportes, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReportes(data || []);
      } catch (error) {
        console.error(error);
        toast.error(error.response?.data?.msg || "Error al cargar tus reportes");
      } finally {
        setCargando(false);
      }
    };

    if (token) cargarDatos();
  }, [token]);

  // Filtro memorizado
  const reportesFiltrados = useMemo(() => {
    let lista = [...reportes];
    if (filtroTipo !== "todos") {
      lista = lista.filter((r) => r.tipo === filtroTipo);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      // El reporte trae `recurso: { titulo, tipo }` por populate en el backend
      lista = lista.filter((r) =>
        (r.recurso?.titulo || "").toLowerCase().includes(q)
      );
    }
    return lista;
  }, [reportes, filtroTipo, query]);

  const abrirDetalle = (rep) => {
    setDetalle(rep);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setDetalle(null);
  };

  if (cargando) {
    return <p className="p-4">Cargando tus recursos utilizados...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-2">Mis Recursos Utilizados</h1>
      <p className="text-gray-500 mb-6">
        Aquí encontrarás el historial de contenidos vistos y cuestionarios respondidos.
      </p>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Buscar por título:</label>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ej: Ansiedad..."
            className="border rounded px-2 py-1 w-full sm:w-72"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Filtrar por tipo:</label>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="border rounded px-2 py-1 w-full sm:w-56"
          >
            <option value="todos">Todos</option>
            <option value="contenido">Contenido</option>
            <option value="cuestionario">Cuestionario</option>
          </select>
        </div>
      </div>

      {/* Lista de reportes */}
      {reportesFiltrados.length === 0 ? (
        <div className="bg-white p-6 rounded border text-center text-gray-500">
          No hay reportes que coincidan con tu búsqueda.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {reportesFiltrados.map((r) => (
            <div key={r._id} className="bg-white rounded border shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`inline-block px-2 py-1 text-xs rounded ${
                    r.tipo === "contenido"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.tipo.toUpperCase()}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(r.fecha).toLocaleString()}
                </span>
              </div>

              <h3 className="font-semibold text-gray-800">
                {r.recurso?.titulo || "(Sin título)"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                ID Recurso: <span className="font-mono">{r.recurso?._id || "—"}</span>
              </p>

              <div className="mt-3">
                <button
                  onClick={() => abrirDetalle(r)}
                  className="text-sm bg-teal-600 hover:bg-teal-700 text-white rounded px-3 py-1"
                >
                  Ver detalle
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Detalle */}
      {modalOpen && detalle && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-xl rounded p-4 shadow">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold">Detalle del Reporte</h2>
              <button
                onClick={cerrarModal}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold">Título:</span>{" "}
                {detalle.recurso?.titulo || "(sin título)"}
              </p>
              <p>
                <span className="font-semibold">Tipo:</span>{" "}
                {detalle.tipo}
              </p>
              <p>
                <span className="font-semibold">Fecha:</span>{" "}
                {new Date(detalle.fecha).toLocaleString()}
              </p>
            </div>

            <div className="mt-3">
              <h3 className="font-semibold">Resultado:</h3>
              {/* Muestra el resultado como JSON bonito */}
              <pre className="bg-gray-100 rounded p-2 text-xs overflow-auto">
                {JSON.stringify(detalle.resultado, null, 2)}
              </pre>

              {/* Ayuda rápida: dependiendo del tipo */}
              {detalle.tipo === "contenido" && (
                <p className="text-xs text-gray-500 mt-2">
                  Suele ser {"{ visto: true }"} u objeto similar.
                </p>
              )}
              {detalle.tipo === "cuestionario" && (
                <p className="text-xs text-gray-500 mt-2">
                  Suele ser un arreglo de respuestas
                  como <code>[{"{ preguntaId, respuesta }"}]</code>.
                </p>
              )}
            </div>

            <div className="text-right mt-4">
              <button
                onClick={cerrarModal}
                className="text-sm bg-gray-500 hover:bg-gray-600 text-white rounded px-3 py-1"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecursosUtilizados;
