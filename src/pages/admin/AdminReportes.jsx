// src/pages/admin/AdminReportes.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import storeAuth from "../../context/storeAuth.jsx";
import { toast } from "react-toastify";

const AdminReportes = () => {
  const { token } = storeAuth();
  const BASE = `${import.meta.env.VITE_BACKEND_URL}/admin`;

  const [loading, setLoading] = useState(false);
  const [reportes, setReportes] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Modal de detalle
  const [showModal, setShowModal] = useState(false);
  const [detalle, setDetalle] = useState(null);

  // Debounce simple
  const [debounced, setDebounced] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 500);
    return () => clearTimeout(t);
  }, [search]);

  const fetchReportes = async () => {
    try {
      setLoading(true);
      const url = `${BASE}/reporte/obtener?search=${encodeURIComponent(debounced)}&page=${page}&limit=${limit}`;
      const { data } = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReportes(data.items || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando reportes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced, page]);

  const handleEliminar = async (id) => {
    if (!confirm("¿Seguro que deseas eliminar este reporte?")) return;
    try {
      const url = `${BASE}/reporte/eliminar/${id}`;
      const { data } = await axios.delete(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.msg || "Reporte eliminado");
      // refrescar
      fetchReportes();
    } catch (err) {
      console.error(err);
      toast.error("No se pudo eliminar el reporte");
    }
  };

  const handleVerDetalle = (rep) => {
    setDetalle(rep);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setDetalle(null);
  };

  const resumenResultado = useMemo(() => (rep) => {
    if (rep.tipo === "contenido") {
      // Esperado: { visto: true, fecha: ... }
      const v = rep.resultado?.visto ? "Visto" : "No visto";
      return `${v}${rep.resultado?.fecha ? ` - ${new Date(rep.resultado.fecha).toLocaleString()}` : ""}`;
    }
    // cuestionario -> contar respuestas
    const total = Array.isArray(rep.resultado?.respuestas) ? rep.resultado.respuestas.length : 0;
    return `Respuestas: ${total}`;
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Reportes de Pacientes</h2>

      {/* Buscador */}
      <div className="flex items-center gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar por paciente (nombre o correo)"
          className="border rounded px-3 py-2 w-full md:w-1/2"
        />
      </div>

      <div className="bg-white border rounded shadow overflow-hidden">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Paciente</th>
              <th className="text-left p-2">Recurso</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Resumen</th>
              <th className="text-right p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {!loading && reportes.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  No hay reportes para mostrar
                </td>
              </tr>
            )}

            {loading && (
              <tr>
                <td colSpan="6" className="p-4 text-center">
                  Cargando...
                </td>
              </tr>
            )}

            {!loading && reportes.map((rep) => (
              <tr key={rep._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{new Date(rep.fecha).toLocaleString()}</td>
                <td className="p-2">{rep.paciente?.nombre} <small className="text-gray-500">({rep.paciente?.email})</small></td>
                <td className="p-2">{rep.recurso?.titulo}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-white ${rep.tipo === 'contenido' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                    {rep.tipo}
                  </span>
                </td>
                <td className="p-2">{resumenResultado(rep)}</td>
                <td className="p-2 text-right">
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded mr-2 hover:bg-indigo-700"
                    onClick={() => handleVerDetalle(rep)}
                  >
                    Ver
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleEliminar(rep._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
          <span className="text-sm text-gray-600">
            Página {page} de {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>

      {/* Modal de detalle */}
      {showModal && detalle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Detalle del Reporte</h3>
              <button onClick={closeModal} className="text-gray-600 hover:text-black">✕</button>
            </div>

            <div className="space-y-2">
              <p><strong>Paciente:</strong> {detalle.paciente?.nombre} ({detalle.paciente?.email})</p>
              <p><strong>Recurso:</strong> {detalle.recurso?.titulo} ({detalle.recurso?.tipo})</p>
              <p><strong>Fecha:</strong> {new Date(detalle.fecha).toLocaleString()}</p>
              <p><strong>Tipo:</strong> {detalle.tipo}</p>

              {detalle.tipo === "contenido" ? (
                <div className="p-3 bg-gray-50 rounded">
                  <p><strong>Visto:</strong> {detalle.resultado?.visto ? "Sí" : "No"}</p>
                  {detalle.resultado?.fecha && (
                    <p><strong>Fecha visto:</strong> {new Date(detalle.resultado.fecha).toLocaleString()}</p>
                  )}
                </div>
              ) : (
                <div className="p-3 bg-gray-50 rounded space-y-1">
                  <p className="font-semibold">Respuestas</p>
                  {Array.isArray(detalle.resultado?.respuestas) ? (
                    detalle.resultado.respuestas.map((r, idx) => (
                      <div key={idx} className="border rounded p-2">
                        <p><strong>Pregunta:</strong> {r.pregunta || r.texto || `#${idx+1}`}</p>
                        <p><strong>Respuesta:</strong> {String(r.valor ?? r.respuesta ?? "")}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-600">No hay respuestas en el reporte</p>
                  )}
                  {detalle.resultado?.puntaje != null && (
                    <p><strong>Puntaje:</strong> {detalle.resultado.puntaje}</p>
                  )}
                </div>
              )}
            </div>

            <div className="text-right mt-4">
              <button className="px-4 py-2 border rounded" onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminReportes;
