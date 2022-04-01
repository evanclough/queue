import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import Room from './Room';
import HomePage from './HomePage';

function App() {
  const [roomVisible, setRoomVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  
  return (
    <div>
    {roomVisible ?
        <Room
          room={currentRoom}
          backToHomepage = {() => setRoomVisible(false)}  
        />
      :
        <HomePage
          setRoomVisible = {() => setRoomVisible(true)}
          setCurrentRoom = {setCurrentRoom}
        /> 
    }
    </div>
  );
}

export default App;
