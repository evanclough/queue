import FullViewNavbar from './FullViewNavbar';
import Queue from './Queue';

const FullView = ({socket, toggleView, backToHomepage, room, accountInfo}) => {
    return (
        <>
            <FullViewNavbar 
                toggleView={toggleView}
                backToHomepage={backToHomepage}
                room={room}
                accountInfo={accountInfo}
            />
            <Queue
                socket={socket}
            />
        </>
    )
}

export default FullView;