import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
function Queue({room}) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:5000/${room}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="Queue">
      {
        socket ?
        <>
          <div> <VideoPlayer socket={socket}/> </div>
          <div> <LinkInput socket={socket}/></div>
        </> :
        "connecting..."
      } 
      
    </div>
  );
}

export default Queue;
