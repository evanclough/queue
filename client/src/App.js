import 'bootstrap/dist/css/bootstrap.min.css';
import {useState} from 'react';
import Queue from './Queue';
import HomePage from './HomePage';

function App() {
  const [roomVisible, setRoomVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  
  return (
    <div className="App">
    {roomVisible ?
        <Queue
        room={currentRoom}
        />
      :
        <HomePage
          setRoomVisible = {setRoomVisible}
          setCurrentRoom = {setCurrentRoom}
        /> 
    }
    </div>
  );
}

export default App;
