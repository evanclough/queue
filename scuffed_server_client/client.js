const { io } = require("socket.io-client");
const mysql = require('mysql2/promise')

/**
 * Connects to database and grabs current rooms.
 * @returns list of current rooms.
 */
async function grabRooms(){
    //connect to db
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: 'queue'
    })
    //grab raw data from db
    const roomsraw = await connection.execute("SELECT * FROM rooms;");
    //translate to just list of room names
    return roomsraw[0].map(room => room.name);
}

/**
 * connects to server and periodically 
 * sends out signal to call main function to all rooms
 */
async function main(){
    //bring in environment variables
    require('dotenv').config();
    //connect to main server
    const socket = io("http://" + process.env.SERVER_URL);
    //grabs list of rooms
    const rooms = await grabRooms();
    //creates connection to each room
    const room_sockets = rooms.map(room => io(`http://localhost:5000/${room}`));
    //creates listener for connections that logs when connected, debug feature
    room_sockets.map(sck => sck.on("connect", () => console.log("conn")));
    //each connection emits a main loop call twice a second
    setInterval(() => {
        room_sockets.map(sck => sck.emit("main_loop", {SECRET_KEY_FOR_SCUFFED_SERVERCLIENT: process.env.SECRET_KEY_FOR_SCUFFED_SERVERCLIENT}))
    }, 500);
}

main();