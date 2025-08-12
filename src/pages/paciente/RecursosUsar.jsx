import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Muestra recursos activos, y permite "utilizarlos" (cuestionario o contenido)
const RecursosUsar = () => {
  const [recursos, setRecursos] = useState([]);
  const token = localStorage.getItem("token")?.replaceAll('"','');

  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/recursos`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecursos(data || []);
      } catch (error) {
        toast.error("Error al cargar recursos");
      }
    })();
  }, [token]);

  const marcarVisto = async (recursoId) => {
    // ejemplo rápido de "usar" un contenido
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/recursos/${recursoId}/utilizar`;
      const { data } = await axios.post(url, { visto: true }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success(data.msg || "Recurso marcado como visto");
    } catch (error) {
      toast.error(error.response?.data?.msg || "No se pudo registrar");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recursos Disponibles</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {recursos.map((r) => (
          <div key={r._id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold text-lg">{r.titulo}</h3>
            <p className="text-sm text-gray-600 mb-2">{r.descripcion}</p>
            <span className="inline-block text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded">
              {r.tipo}
            </span>

            {r.tipo === "contenido" && (
              <div className="mt-4 flex gap-2">
                {r.referencia?.url && (
                  <a
                    className="text-blue-600 hover:underline"
                    href={r.referencia.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Ver contenido
                  </a>
                )}
                <button
                  onClick={() => marcarVisto(r._id)}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded"
                >
                  Marcar como visto
                </button>
              </div>
            )}

            {r.tipo === "cuestionario" && (
              <div className="mt-4">
                <button
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                  onClick={() => {
                    // Aquí puedes navegar a una página donde renderices el cuestionario y luego envíes respuestas
                    // navigate(`/paciente/recursos/cuestionario/${r._id}`)
                    toast.info("Abrir formulario de cuestionario (por implementar)");
                  }}
                >
                  Responder cuestionario
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecursosUsar;
