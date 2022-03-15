import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import FindRoomInput from './FindRoomInput';

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <div className="App">
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
    </div>
  );
}

export default HomePage;
