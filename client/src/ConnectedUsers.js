import {useState, useEffect} from 'react';

const ConnectedUsers = ({socket}) => {
    const [connectedUsers, setConnectedUsers] = useState(0);

    useEffect(() => {
        socket.on("connected_users", data => {
            setConnectedUsers(data.connected_users);
        })
    }, [socket, connectedUsers])

    return (
        <h4>
            Connected Users: {connectedUsers - 1}
        </h4>
    )
}

export default ConnectedUsers;