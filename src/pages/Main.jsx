import React from "react";
import { motion } from "framer-motion";

const Main = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: "url('/freepik.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Bienvenido a <span className="text-purple-300">MentalAPP</span>
          </h1>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Tu espacio para el bienestar mental. Conectamos tecnología y salud
            para ayudarte a cuidar de ti mismo.
          </p>
        </motion.div>
      </section>

      {/* Sobre Nosotros */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-700">
            ¿Quiénes somos?
          </h2>
          <p className="text-gray-600 text-lg">
            MentalAPP es una plataforma dedicada a mejorar la salud mental de
            los estudiantes de la ESFOT. Ofrecemos recursos, cuestionarios y
            seguimiento personalizado para fomentar el bienestar emocional y
            prevenir riesgos psicológicos.
          </p>
        </motion.div>
      </section>

      {/* Servicios */}
      <section className="py-16 px-6 bg-gray-100">
        <motion.div
          className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">
              Cuestionarios
            </h3>
            <p className="text-gray-600">
              Evalúa tu estado emocional con encuestas adaptadas a tus
              necesidades y recibe orientación personalizada.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">
              Recursos de apoyo
            </h3>
            <p className="text-gray-600">
              Accede a artículos, videos y guías creadas por especialistas en
              salud mental.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition">
            <h3 className="text-xl font-semibold mb-2 text-purple-700">
              Comunicación directa
            </h3>
            <p className="text-gray-600">
              Conéctate con profesionales y recibe asistencia en momentos
              difíciles.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Contacto */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-700">
            Contáctanos
          </h2>
          <p className="text-gray-600 mb-6">
            Si necesitas más información o asistencia, estamos aquí para ti.
          </p>
          <div className="flex flex-col gap-3 text-gray-700">
            <p>📧 contacto@mentalapp.com</p>
            <p>📍 Quito, Ecuador</p>
            <p>📞 +593 987 654 321</p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-900 text-center text-white text-sm">
        © {new Date().getFullYear()} MentalAPP - Todos los derechos reservados.
      </footer>
    </div>
  );
};

export default Main;
