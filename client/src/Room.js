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
        <>
        {fullView ? <div id = 'leftSideOfRoom'>
            <div id='roomHeader'><h1>room: {room}</h1></div>
            <CurrentVideoHeader socket={socket}/>
            <div id = 'videoPlayerContainer'> <VideoPlayer socket={socket}/> </div>
            <div> <VotesToSkip socket={socket} /></div>
            <Skipping socket={socket}/>
          </div> : ""}
          
          <div id ='rightSideOfRoom'>
          <div id = 'connectedUsers'><ConnectedUsers socket={socket}/></div>
            <Queue socket={socket}/>
            <div id = "linkInput"> <LinkInput socket={socket}/></div>
            <div id = "backToHomepageButton"><button onClick={backToHomepage} > Back to homepage</button></div>
            <div id="toggleViewButton"><ToggleView toggleView={toggleView}/></div>

          </div>
        </> :
        "connecting..."
      } 
      
    </div>
  );
}

export default Room;
