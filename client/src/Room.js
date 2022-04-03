import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import { io } from 'socket.io-client';
import LinkInput from './LinkInput';
import VideoPlayer from './VideoPlayer';
import Queue from './Queue';
import FullViewNavbar from './FullViewNavbar';
import ConnectedUsers from './ConnectedUsers';
import CurrentVideoHeader from './CurrentVideoHeader';
import VotesToSkip from './VoteToSkip';
import ToggleView from './ToggleView';
import FullView from './FullView';
import QueueView from './QueueView';

function Room({room, backToHomepage}) {
  const [socket, setSocket] = useState(null);
  const [fullView, setFullView] = useState(false);

  const toggleView = () => {
    setFullView(fullView ? false : true); //i know this looks scuffed but i don't want to mess with the references
  }
  
  useEffect(() => {
    const newSocket = io(`http://localhost:5000/${room}`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, room]);

  return (  
    <>
      { 
        socket ?
        <>
          <FullViewNavbar 
            toggleView={toggleView}
            backToHomepage={backToHomepage}
            room={room}
            socket={socket}
          />
          <div id = {fullView ? "fullViewContainer" : "queueViewContainer"}>
            {fullView ? 
              <VideoPlayer 
                socket={socket}
                fullView={fullView}
              /> : <></>
            }
            <Queue
              socket = {socket}
              fullView = {fullView}
            />
          </div>
      </>
      :
        "connecting..."
      } 
      
    </>
  );
}

export default Room;
