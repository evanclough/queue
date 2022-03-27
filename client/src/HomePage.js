import 'bootstrap/dist/css/bootstrap.min.css';
import FindRoomInput from './FindRoomInput';
import Header from "./Header";

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <div id="homePageContainer">
        <Header/>
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
    </div>
  );
}

export default HomePage;
