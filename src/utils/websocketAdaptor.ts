import socketIOClient from "socket.io-client";
import sailsIOClient from "sails.io.js";
const apiUrl = import.meta.env.VITE_API_URL;
const io = sailsIOClient(socketIOClient);
io.sails.url = apiUrl;
// io.sails.reconnection = true;
// io.sails.rejectUnauthorized = false;
// io.sails.headers = {
//   authorization:
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
//   origin: "http://localhost:3000",
// };

// io.sails.transports = ["websocket"];
export default io;

// import { io } from "socket.io-client";

// function connectWebSOckets() {
//   //enter here the action you want to do once loaded
//   const socket = io("http://localhost:5000", {
//     secure: true,
//     reconnection: true,
//     rejectUnauthorized: false,
//     transports: ["websocket"],
//   });
//   debugger;
//   socket.on("connect", () => {
//     console.log("connect", socket.connected); // true
//   });

//   socket.on("hello", (data) => {
//     console.log("hello", data); // false
//   });
//   socket.on("connect_error", function (err) {
//     console.log("Connection Failed", err);
//   });
//   socket.on("connect_failed", function (err) {
//     console.log("Connection Failed", err);
//   });
//   socket.on("error", function (err) {
//     console.log("Connection Failed", err);
//   });
// }
