import 'bootstrap/dist/css/bootstrap.min.css';
import FindRoomInput from './FindRoomInput';
import HomepageHeader from './HomepageHeader';

function HomePage({setRoomVisible, setCurrentRoom}) {

  return (
    <>
        <HomepageHeader/>
        <FindRoomInput
            setRoomVisible={setRoomVisible}
            setCurrentRoom={setCurrentRoom}
        />
    </>
  );
}

export default HomePage;
