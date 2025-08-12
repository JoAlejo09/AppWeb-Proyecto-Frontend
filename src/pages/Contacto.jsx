import React, { useState } from "react";

const Contacto = () => {
  const [copiado, setCopiado] = useState(null);

  const datos = {
    institucion: "ESFOT - Escuela de Formación de Tecnólogos (EPN)",
    direccion: "Ladrón de Guevara E11-253, Quito 170517, Ecuador",
    telefono: "+593 2 297 6300",
    email: "esfot@epn.edu.ec",
    web: "https://www.esfot.epn.edu.ec/",
    horario: "Lunes a Viernes, 08:00 - 17:00",
    mapsUrl:
      "https://www.google.com/maps/place/Escuela+Politécnica+Nacional/@-0.21025,-78.489,15z",
    // Coordenadas aproximadas del campus EPN
    lat: -0.2102,
    lng: -78.4887,
  };

  const copiar = async (texto, clave) => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(clave);
      setTimeout(() => setCopiado(null), 2000);
    } catch (e) {
      console.error("No se pudo copiar", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 text-center">
          Contáctanos
        </h1>
        <p className="text-gray-600 text-center mt-2 max-w-2xl mx-auto">
          Ponte en contacto con la <span className="font-semibold">ESFOT</span> (Escuela de Formación de Tecnólogos de la EPN).
          Aquí encontrarás nuestra información de contacto y ubicación.
        </p>
      </div>

      {/* Contenido */}
      <div className="max-w-6xl mx-auto px-4 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de Información */}
        <div className="lg:col-span-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h2>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Institución</p>
              <p className="text-gray-800 font-medium">{datos.institucion}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Dirección</p>
              <p className="text-gray-800">{datos.direccion}</p>
              <button
                onClick={() => copiar(datos.direccion, "direccion")}
                className="text-indigo-600 text-sm hover:underline"
              >
                {copiado === "direccion" ? "¡Copiado!" : "Copiar dirección"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Teléfono</p>
                <a
                  href={`tel:${datos.telefono.replace(/\s/g, "")}`}
                  className="text-gray-800 hover:text-indigo-600"
                >
                  {datos.telefono}
                </a>
              </div>
              <button
                onClick={() => copiar(datos.telefono, "telefono")}
                className="text-indigo-600 text-sm hover:underline"
              >
                {copiado === "telefono" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Correo</p>
                <a
                  href={`mailto:${datos.email}`}
                  className="text-gray-800 hover:text-indigo-600"
                >
                  {datos.email}
                </a>
              </div>
              <button
                onClick={() => copiar(datos.email, "email")}
                className="text-indigo-600 text-sm hover:underline"
              >
                {copiado === "email" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sitio Web</p>
                <a
                  href={datos.web}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  {datos.web}
                </a>
              </div>
              <button
                onClick={() => copiar(datos.web, "web")}
                className="text-indigo-600 text-sm hover:underline"
              >
                {copiado === "web" ? "¡Copiado!" : "Copiar"}
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-500">Horario de Atención</p>
              <p className="text-gray-800">{datos.horario}</p>
            </div>

            <div className="pt-2">
              <a
                href={datos.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
              >
                Abrir en Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="lg:col-span-2 bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ubicación</h2>
            <p className="text-gray-600 mb-4">
              Campus de la Escuela Politécnica Nacional (EPN), Quito - Ecuador.
            </p>

            <div className="w-full h-80 md:h-[420px] rounded-lg overflow-hidden border">
              {/* Google Maps Embed - no requiere API key para este iframe */}
              <iframe
                title="Mapa ESFOT EPN"
                width="100%"
                height="100%"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD_demo-key-no-real&zoom=16&q=${datos.lat},${datos.lng}`}
              />
            </div>

            <div className="mt-4 flex gap-3">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${datos.lat},${datos.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-md border border-indigo-600 text-indigo-700 hover:bg-indigo-50 transition"
              >
                Ver ruta
              </a>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${datos.lat},${datos.lng}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Cómo llegar
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sección adicional opcional */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Sobre ESFOT</h3>
          <p className="text-gray-600">
            La Escuela de Formación de Tecnólogos (ESFOT) de la EPN forma profesionales
            con competencias técnicas y humanas, orientados a la innovación, investigación
            y vinculación con la sociedad. Para más información visita el sitio oficial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contacto;
