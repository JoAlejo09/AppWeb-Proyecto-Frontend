import {io} from 'socket.io-client';
const token = localStorage.getItem('token');

const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL || "http://localhost:4001", {
    auth: {
        token,
    },
    autoConnect: false,
});
export default socket;