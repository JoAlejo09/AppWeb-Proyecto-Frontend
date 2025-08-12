import React from "react";
import { Link } from "react-router-dom";

const Informacion = () => {
  return (
    <div className="w-full">
      {/* Hero / Encabezado */}
      <section className="relative bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-16">
        <div className="absolute inset-0 bg-[url('/freemp.jpeg')] bg-cover bg-center opacity-15" />
        <div className="relative container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-extrabold mb-4 drop-shadow">
              MentalAPP: Bienestar y seguimiento de salud mental para estudiantes ESFOT
            </h1>
            <p className="text-lg text-purple-100 mb-6 leading-relaxed">
              Una plataforma web que conecta a estudiantes con recursos de salud mental,
              cuestionarios, monitoreo y comunicación directa con administradores/profesionales,
              todo en un entorno seguro y fácil de usar.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/registro"
                className="px-5 py-2 bg-white/90 text-purple-700 font-semibold rounded hover:bg-white transition"
              >
                Comenzar ahora
              </Link>
              <Link
                to="/login"
                className="px-5 py-2 border border-white text-white font-semibold rounded hover:bg-white/10 transition"
              >
                Ya tengo cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lo que puedes hacer */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">¿Qué puedes hacer con MentalAPP?</h2>
        <p className="text-gray-600 max-w-3xl mb-8">
          MentalAPP te permite acceder a <strong>recursos de salud mental</strong> (artículos, videos, guías),
          <strong> completar cuestionarios</strong> con registro de respuestas, comunicarte en tiempo real mediante
          <strong> chat</strong>, y <strong>agendar & pagar citas</strong> con Stripe. Además, administra el
          seguimiento de tu bienestar con <strong>reportes</strong> e indicadores, y recibe alertas preventivas.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📚 Recursos de Salud Mental</h3>
            <p className="text-gray-600">
              Accede a artículos, videos, guías, y contenidos curados. Marca como “visto”, guarda favoritos
              y mejora tu conocimiento sobre manejo de ansiedad, estrés, hábitos saludables, etc.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📝 Cuestionarios</h3>
            <p className="text-gray-600">
              Responde encuestas y cuestionarios personalizados. El sistema genera un registro de tu avance y
              resultados para poder darte un mejor acompañamiento.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">💬 Chat en tiempo real</h3>
            <p className="text-gray-600">
              Conversa con el equipo de soporte o un administrador mediante un chat en tiempo real (Socket.io).
              Recibe orientación y resuelve dudas de forma inmediata.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📅 Citas y Pagos</h3>
            <p className="text-gray-600">
              Agenda citas de atención y realiza pagos seguros con <strong>Stripe</strong>.
              Recibe confirmaciones y recordatorios para no perder tu sesión.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">📈 Reportes e Indicadores</h3>
            <p className="text-gray-600">
              Accede a reportes de uso y resultados de cuestionarios. Observa tendencias y mejora tus hábitos con
              información valiosa.
            </p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">🔔 Alertas Preventivas</h3>
            <p className="text-gray-600">
              El sistema permite generar alertas sobre posibles riesgos en base a tus interacciones
              (por ejemplo, señales de estrés o ansiedad elevadas).
            </p>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Perfiles y Funcionalidades</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">👤 Paciente / Estudiante</h3>
              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Visualizar y utilizar recursos de salud mental.</li>
                <li>Completar cuestionarios y registrar respuestas.</li>
                <li>Chatear con un administrador en tiempo real.</li>
                <li>Agendar y pagar citas con Stripe.</li>
                <li>Acceder a su perfil y editar datos personales.</li>
                <li>Consultar sus reportes e historial.</li>
              </ul>
            </div>
            <div className="p-6 bg-white rounded-lg shadow">
              <h3 className="text-2xl font-semibold mb-4">🛠️ Administrador</h3>
              <ul className="space-y-2 text-gray-600 list-disc pl-5">
                <li>Gestionar pacientes: listar, editar, dar de baja.</li>
                <li>Gestionar recursos: crear, actualizar y eliminar.</li>
                <li>Ver reportes y métricas de uso.</li>
                <li>Monitorear actividad y generar alertas.</li>
                <li>Configurar cuestionarios y contenidos que verá el paciente.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">¿Cómo funciona?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">1. Regístrate o inicia sesión</h3>
            <p className="text-gray-600">Puedes crear tu cuenta o iniciar con Google/Facebook (OAuth). Tu perfil define el acceso (Paciente/Administrador).</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">2. Usa los recursos</h3>
            <p className="text-gray-600">Explora contenidos, completa cuestionarios, y realiza seguimiento. Cada acción puede generar un registro (reporte).</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">3. Comunícate y agenda</h3>
            <p className="text-gray-600">Usa el chat para resolver dudas. Agenda y paga citas con Stripe cuando lo necesites.</p>
          </div>
        </div>
      </section>

      {/* Seguridad */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Privacidad & Seguridad</h2>
          <p className="text-gray-600 max-w-3xl">
            MentalAPP utiliza <strong>JWT</strong> para autenticación, <strong>CORS</strong> configurado, y
            almacenamiento seguro (MongoDB). Los pagos se realizan con <strong>Stripe</strong> (PCI-compliant).
            OAuth con Google y Facebook se integra para facilitar el acceso. Nos tomamos la privacidad en serio:
            tu información personal es tratada con confidencialidad.
          </p>
        </div>
      </section>

      {/* Preguntas frecuentes */}
      <section className="container mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Preguntas Frecuentes</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <details className="bg-gray-50 rounded p-4">
            <summary className="font-semibold cursor-pointer">¿MentalAPP reemplaza la atención profesional?</summary>
            <p className="text-gray-600 mt-2">No. MentalAPP es una herramienta de apoyo y seguimiento. Para situaciones delicadas, siempre consulta con un profesional.</p>
          </details>
          <details className="bg-gray-50 rounded p-4">
            <summary className="font-semibold cursor-pointer">¿Puedo usar mi cuenta Google/Facebook?</summary>
            <p className="text-gray-600 mt-2">Sí. Puedes autenticarse con OAuth y tu perfil será identificado como Paciente o Administrador según corresponda.</p>
          </details>
          <details className="bg-gray-50 rounded p-4">
            <summary className="font-semibold cursor-pointer">¿Cómo se manejan los pagos?</summary>
            <p className="text-gray-600 mt-2">A través de Stripe. Acepta tarjetas de prueba para desarrollo y tarjetas reales en producción.</p>
          </details>
          <details className="bg-gray-50 rounded p-4">
            <summary className="font-semibold cursor-pointer">¿Se guarda mi información de uso?</summary>
            <p className="text-gray-600 mt-2">Sí, se registran interacciones para genera reportes y métricas, con fines de seguimiento y mejora del servicio.</p>
          </details>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-50 py-14">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Empieza a cuidar tu bienestar con MentalAPP
          </h2>
          <p className="text-gray-600 mb-6">
            Crea tu cuenta y accede a recursos, cuestionarios, chat, citas y más.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/registro"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold"
            >
              Registrarme
            </Link>
            <Link
              to="/informacion"
              className="px-6 py-3 bg-white border text-indigo-700 rounded-xl font-semibold hover:bg-gray-50"
            >
              Saber más
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Informacion;
