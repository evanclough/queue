const { io } = require("socket.io-client");

const socket = io("http://localhost:5000");
const rooms = ["poggers", "poggers2"];
const room_sockets = rooms.map(room => io(`http://localhost:5000/${room}`));

room_sockets.map(sck => sck.on("connect", () => console.log("conn")));

setInterval(() => {
    room_sockets.map(sck => sck.emit("main_loop"))
}, 500);

