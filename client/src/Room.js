import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
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
          <div> <VideoPlayer socket={socket}/> </div>
          <div> <LinkInput socket={socket}/></div>
          <div><button onClick={backToHomepage} > Back to homepage</button></div>
        </> :
        "connecting..."
      } 
      
    </div>
  );
}

export default Room;
