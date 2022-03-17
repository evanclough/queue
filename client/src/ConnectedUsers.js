import {useState, useEffect} from 'react';

const ConnectedUsers = ({socket}) => {
    const [connectedUsers, setConnectedUsers] = useState(0);

    useEffect(() => {
        socket.on("connected_users", data => {
            setConnectedUsers(data.connected_users);
        })
    }, [socket, connectedUsers])

    return (
        <>
            Connected Users: {connectedUsers}
        </>
    )
}

export default ConnectedUsers;