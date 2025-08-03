import { useForm } from "react-hook-form";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

const Recuperar = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const url = `${import.meta.env.VITE_BACKEND_URL}/usuarios/recuperarpassword`;
      const response = await axios.post(url, data);
      toast.success(response.data.msg || "Correo enviado correctamente", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (error) {
      const mensaje = error.response?.data?.msg || "Error al enviar la solicitud";
      toast.error(mensaje, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <ToastContainer />

      {/* Sección del formulario */}
      <div className="w-full sm:w-1/2 h-screen bg-white flex justify-center items-center">
        <div className="md:w-4/5 sm:w-full">
          <h1 className="text-3xl font-semibold mb-2 text-center uppercase text-gray-500">
            ¡Olvidaste tu contraseña!
          </h1>
          <small className="text-gray-400 block my-4 text-sm text-center">
            No te preocupes, te ayudamos a recuperarla.
          </small>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-semibold">Correo electrónico</label>
              <input
                type="email"
                placeholder="Ingresa un correo válido"
                className="block w-full rounded-md border border-gray-300 focus:border-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-700 py-2 px-3 text-gray-700"
                {...register("email", { required: "El correo electrónico es obligatorio" })}
              />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="bg-gray-600 text-white border py-2 w-full rounded-xl mt-3 hover:scale-105 duration-300 hover:bg-gray-900"
            >
              Enviar correo
            </button>
          </form>

          <div className="mt-6 text-xs border-b-2 py-4"></div>

          <div className="mt-3 text-sm flex justify-between items-center">
            <p>¿Ya recordaste tu contraseña?</p>
            <Link
              to="/login"
              className="py-2 px-5 bg-gray-600 text-white border rounded-xl hover:scale-110 duration-300 hover:bg-gray-900"
            >
              Iniciar sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Sección de imagen lateral (solo en pantallas grandes) */}
      <div
        className="w-full sm:w-1/2 h-1/3 sm:h-screen bg-[url('/freep.jpeg')] bg-no-repeat bg-cover bg-center sm:block hidden"
      ></div>
    </div>
  );
};

export default Recuperar;
