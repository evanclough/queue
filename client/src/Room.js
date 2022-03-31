import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
import Queue from './Queue';
import ConnectedUsers from './ConnectedUsers';
import CurrentVideoHeader from './CurrentVideoHeader';
import VotesToSkip from './VoteToSkip';
import Skipping from './Skipping';
import ToggleView from './ToggleView';
import FullView from './FullView';
import QueueView from './QueueView';

function Room({room, backToHomepage}) {
  const [socket, setSocket] = useState(null);
  const [fullView, setFullView] = useState(true);

  const toggleView = () => {
    setFullView(fullView ? false : true); //i know this looks scuffed but i don't want to mess with the references
  }

  useEffect(() => {
    const newSocket = io(`http://localhost:5000/${room}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, room]);

  return (  
    <div id="roomContainer">
      { 
        socket ?
          fullView ?
            <FullView 
              socket={socket}
              backToHomepage={backToHomepage}
              toggleView={toggleView}
              room={room}
              accountInfo = {{name: null}}
            />
          :
            <QueueView 
              socket={socket}
              backToHomepage={backToHomepage}
              toggleView={toggleView}
              room={room}
              accountInfo = {{name: null}}
            />  
      :
        "connecting..."
      } 
      
    </div>
  );
}

export default Room;
