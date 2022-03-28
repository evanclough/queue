import 'bootstrap/dist/css/bootstrap.min.css';
import FindRoomInput from './FindRoomInput';
import Header from "./Header";

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <>
        <Header/>
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
    </>
  );
}

export default HomePage;
