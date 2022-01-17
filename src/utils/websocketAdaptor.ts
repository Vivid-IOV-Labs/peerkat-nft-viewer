import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
const apiUrl = import.meta.env.VITE_API_URL;
const io = sailsIOClient(socketIOClient);
io.sails.url = apiUrl;
export default io;
