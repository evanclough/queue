import FullViewNavbar from "./FullViewNavbar"
import Queue from "./Queue"
import VotesToSkip from "./VoteToSkip"

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
                <div id = "queueVoteToSkipContainer">
                    <VotesToSkip 
                        socket={socket}
                        fullView={false}
                    />
                    </div>
                <Queue
                    socket={socket}
                    fullView = {false}
                />
            </div>
        </>
    )
}

export default QueueView