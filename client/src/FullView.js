import FullViewNavbar from './FullViewNavbar';
import Queue from './Queue';
import VideoPlayer from './VideoPlayer';

const FullView = ({socket, toggleView, backToHomepage, room, accountInfo}) => {
    return (
        <>
            <FullViewNavbar 
                toggleView={toggleView}
                backToHomepage={backToHomepage}
                room={room}
                accountInfo={accountInfo}
                socket={socket}
            />
            <div id = "fullViewContainer">
                <VideoPlayer 
                socket={socket}
                fullView={true}
                />
                <Queue
                    socket={socket}
                    fullView={true}
                />
            </div>
        </>
    )
}

export default FullView;