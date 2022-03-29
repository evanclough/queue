const { io } = require("socket.io-client");
const mysql = require('mysql2/promise')

const socket = io("http://localhost:5000");

async function grabRooms(){
    require('dotenv').config();
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'queue'
    })
    const roomsraw = await connection.execute("SELECT * FROM rooms;");
    return roomsraw[0].map(room => room.name);
}

async function main(){
    const rooms = await grabRooms();

    const room_sockets = rooms.map(room => io(`http://localhost:5000/${room}`));

    room_sockets.map(sck => sck.on("connect", () => console.log("conn")));

    setInterval(() => {
        room_sockets.map(sck => sck.emit("main_loop", {SECRET_KEY_FOR_SCUFFED_SERVERCLIENT: process.env.SECRET_KEY_FOR_SCUFFED_SERVERCLIENT}))
    }, 500);
}

main();