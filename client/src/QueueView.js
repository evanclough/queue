import FullViewNavbar from "./FullViewNavbar"
import Queue from "./Queue"

const QueueView = ({socket, backToHomepage, toggleView, room, accountInfo}) => {
    return (
        <>
            <FullViewNavbar 
                toggleView={toggleView}
                backToHomepage={backToHomepage}
                room={room}
                accountInfo={accountInfo}
                socket={socket}
            />
            <div id = "queueViewContainer">
                <Queue
                    socket={socket}
                    fullView = {false}
                />
            </div>
        </>
    )
}

export default QueueView