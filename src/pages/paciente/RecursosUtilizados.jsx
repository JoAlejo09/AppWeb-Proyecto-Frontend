import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// Lista reportes del paciente
const RecursosUtilizados = () => {
  const [reportes, setReportes] = useState([]);
  const token = localStorage.getItem("token")?.replaceAll('"','');

  useEffect(() => {
    (async () => {
      try {
        const url = `${import.meta.env.VITE_BACKEND_URL}/pacientes/reportes/mios`;
        const { data } = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReportes(data || []);
      } catch (error) {
        toast.error("Error al cargar reportes");
      }
    })();
  }, [token]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recursos Utilizados</h2>
      <div className="space-y-3">
        {reportes.map((rep) => (
          <div key={rep._id} className="bg-white rounded shadow p-4">
            <h3 className="font-semibold">Recurso: {rep.recurso?.titulo || "N/A"}</h3>
            <p className="text-sm text-gray-600">
              Tipo: {rep.tipo} — Fecha: {new Date(rep.fecha).toLocaleString()}
            </p>
            <pre className="bg-gray-100 p-2 rounded text-xs mt-2">
              {JSON.stringify(rep.resultado, null, 2)}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecursosUtilizados;
