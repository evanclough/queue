import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
import Queue from './Queue';
import ConnectedUsers from './ConnectedUsers';
import CurrentVideoHeader from './CurrentVideoHeader';

function Room({room, backToHomepage}) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`http://localhost:5000/${room}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, room]);

  return (
    <div id="roomContainer">
      { 
        socket ?
        <>
          <div id = 'leftSideOfRoom'>
            <div id='roomHeader'><h1>room: {room}</h1></div>
            <div id = 'connectedUsers'><ConnectedUsers socket={socket}/></div>
            <CurrentVideoHeader socket={socket}/>
            <div id = 'videoPlayerContainer'> <VideoPlayer socket={socket}/> </div>
            <div id = "linkInput"> <LinkInput socket={socket}/></div>
            <div id = "backToHomepageButton"><button onClick={backToHomepage} > Back to homepage</button></div>
          </div>
          <div id ='rightSideOfRoom'>
            <Queue socket={socket}/>
          </div>
        </> :
        "connecting..."
      } 
      
    </div>
  );
}

export default Room;
