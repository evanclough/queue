import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
import Queue from './Queue';
import ConnectedUsers from './ConnectedUsers';

function Room({room, backToHomepage}) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:5000/${room}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, room]);

  return (
    <div className="Queue">
      { 
        socket ?
        <>
          <div>room: {room}</div>
          <div> <VideoPlayer socket={socket}/> <Queue socket={socket}/></div>
          <div> <LinkInput socket={socket}/></div>
          <div><button onClick={backToHomepage} > Back to homepage</button></div>
          <div><ConnectedUsers socket={socket}/></div>
        </> :
        "connecting..."
      } 
      
    </div>
  );
}

export default Room;
