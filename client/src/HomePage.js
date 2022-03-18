import 'bootstrap/dist/css/bootstrap.min.css';
import FindRoomInput from './FindRoomInput';
import CreateRoomInput from "./CreateRoomInput";

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <div className="App">
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
        <CreateRoomInput/>
    </div>
  );
}

export default HomePage;
