import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import Queue from './Queue';
import HomePage from './HomePage';

function App() {
  const [roomVisible, setRoomVisible] = useState(false);
  const [currentRoom, setCurrentRoom] = useState("");
  useEffect(() => {  
    const newSocket = io(`http://localhost:5000/a`);
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
    {roomVisible ?
    <HomePage
      setRoomVisible = {setRoomVisible}
      setCurrentRoom = {setCurrentRoom}
    /> :
    <Queue
      room={currentRoom}
    />
    }
    </div>
  );
}

export default App;
