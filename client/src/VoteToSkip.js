import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

const VotesToSkip = ({socket, fullView}) => {
    const [votesToSkip, setVotesToSkip] = useState(0);
    const [showVoteToSkipButton, setShowVoteToSkipButton] = useState(false);
    const [showVotesToSkip, setShowVotesToSkip] = useState(false);
    const [connectedUsers, setConnectedUsers] = useState(0);
    const [showSkipping, setShowSkipping] = useState(false);

    useEffect(() => {
        socket.on("add_vote_to_skip", () => {
            setVotesToSkip(votesToSkip + 1);
        })
        socket.on("switch_video", data => {
            setShowVotesToSkip(data.videoID !== "-1");
            setShowVoteToSkipButton(data.videoID !== "-1");
            setVotesToSkip(0);
        })
        socket.on("connected_users", data => {
            setConnectedUsers(data.connected_users);
        })
        socket.on("skipping", () => {
            setShowSkipping(true);
            setTimeout(() => setShowSkipping(false), 3000);
        })
    }, [socket, votesToSkip])

    return (
        <>{showVotesToSkip || showSkipping ? 
            <ListGroupItem>
        <ListGroup horizontal>
            {
                showSkipping ? 
                <ListGroupItem id = {fullView ? "voteToSkipText" : "queueVoteToSkipText"}>

                    skipping video...
                    </ListGroupItem>
: 
                        showVotesToSkip ?  
                        <ListGroupItem id = {fullView ? "voteToSkipText" : "queueVoteToSkipText"}>
                            Current Votes to Skip: {votesToSkip} / {Math.floor(connectedUsers / 2) + 1}
                        </ListGroupItem>
:
                        ""
            }
        
            {
            showVoteToSkipButton ? 
            <ListGroupItem id = {fullView ? "voteToSkipButton" : "queueVoteToSkipButton"}>
                <Button onClick = {() => {
                    socket.emit("vote_to_skip");
                    setShowVoteToSkipButton(false);
                }}>
                    Vote to Skip
                 </Button>             
            </ListGroupItem>
            : ""

            }
            
    </ListGroup> </ListGroupItem>: ""}
        
        </>
    )
}

export default VotesToSkip;