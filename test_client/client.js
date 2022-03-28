const { io } = require("socket.io-client");
const mysql = require('mysql2/promise')

const socket = io("http://localhost:5000");

async function grabRooms(){
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'queue'
    })
    const roomsraw = await connection.execute("SELECT * FROM rooms;");
    return roomsraw[0].map(room => room.name);
}

async function main(){
    const rooms = await grabRooms();

    console.log(rooms);

    const room_sockets = rooms.map(room => io(`http://localhost:5000/${room}`));

    room_sockets.map(sck => sck.on("connect", () => console.log("conn")));

    setInterval(() => {
        room_sockets.map(sck => sck.emit("main_loop"))
    }, 500);
}

main();