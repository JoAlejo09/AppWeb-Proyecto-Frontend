import {create} from "zustand";
import {persist} from "zustand/middleware";

const storeAuth = create(
    persist(
        (set)=>({
            token:null,
            nombre:null,
            rol:null,

            setToken: (token)=> set({token}),
            setNombre: (nombre) => set ({nombre}),
            setRol: (rol)=>set({rol}),

            clearAuth: () => set({ token: null, nombre: null, rol: null }),
        }),
        {
            name: "usuario", // clave en localStorage
            partialize: (state) => ({
                token: state.token,
                nombre: state.name,
                rol: state.rol,
            }), 
        }

    )
)
export default storeAuth;