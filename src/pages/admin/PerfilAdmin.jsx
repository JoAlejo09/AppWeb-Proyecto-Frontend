import React, {useEffect,useState} from "react";
import axios from "axios";
import {useForm} from "react-hook-form"
import storeAuth from "../../context/storeAuth.jsx";
import {toast} from "react-toastify"

const PerfilAdmin = () =>{
    const {token} = storeAuth();
    const [cargando, setCargando] =useState(true);
    const {register, handleSubmit, setValue} = useForm();

    useEffect(()=>{
        const cargaPerfil = async ()=>{
            try {
                const url = `${import.meta.env.VITE_BACKEND_URL_ADMIN}perfil`;

                const {data} = await axios.get(url, {
                    headers: {Authorization: `Bearer ${token}`
                },
            });
            // Cargar los valores en el formulario
                setValue("nombre", data.nombre);
                setValue("email", data.email);
                setValue("telefono", data.telefono || "");
                setValue("direccion", data.direccion || "");
                setCargando(false);
            } catch (error) {
               console.error(error);
               toast.error("Error al cargar el perfil"); 
            }
        };
        cargaPerfil();
    },[token, setValue]);
    const onSubmit = async (formData) => {
        try {
            const url = `${import.meta.env.VITE_BACKEND_URL_ADMIN}perfil`;
            const {data} = await axios.put(url,
                formData,
                {
                    headers:{
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success(data.msg);
        } catch (error) {
            console.error(error);
            toast.error("No se pudo actualizar el perfil");
        }
    };
    if (cargando) return <p>Cargando perfil...</p>;

    return(
        <div className="p-4 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Perfil del Administrador</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block">Nombre:</label>
                    <input {...register("nombre")} className="w-full border px-2 py-1" />
                </div>
                <div>
                    <label className="block">Correo electrónico:</label>
                    <input {...register("email")}
                        type="email"
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div>
                    <label className="block">Teléfono:</label>
                    <input {...register("telefono")}
                        type="text"
                        className="w-full border px-2 py-1"
                    />
                </div>
                <div>
                  <label className="block">Dirección:</label>
                  <input
                    {...register("direccion")}
                    type="text"
                    className="w-full border px-2 py-1"
                />
                </div>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Guardar cambios
                </button>
            </form>
        </div>
    );
};
export default PerfilAdmin;