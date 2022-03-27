import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import FindRoomInput from './FindRoomInput';
import CreateRoomInput from "./CreateRoomInput";

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <div id="container">
      <div id = "homepage">
        <h1> Queue</h1>
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
        <CreateRoomInput/>
      </div>
    </div>
  );
}

export default HomePage;
