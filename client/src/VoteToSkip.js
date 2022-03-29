import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


const VotesToSkip = ({socket}) => {
    const [votesToSkip, setVotesToSkip] = useState(0);
    const [showVoteToSkipButton, setShowVoteToSkipButton] = useState(false);
    const [showVotesToSkip, setShowVotesToSkip] = useState(false);

    useEffect(() => {
        socket.on("add_vote_to_skip", () => {
            setVotesToSkip(votesToSkip + 1);
        })
        socket.on("switch_video", data => {
            setShowVotesToSkip(data.videoID !== "-1");
            setShowVoteToSkipButton(data.videoID !== "-1");
            setVotesToSkip(0);
        })
    }, [socket, votesToSkip])

    return (
        <div id = "voteToSkipContainer">
        <div id = "voteToSkipText">{showVotesToSkip ? <h4> Current Votes to Skip: {votesToSkip}</h4> : ""}</div>
        <div id = "voteToSkipButton">
            {
            showVoteToSkipButton ? <button onClick = {() => {
                socket.emit("vote_to_skip");
                setShowVoteToSkipButton(false);
            }}> Vote to Skip</button> : ""

            }
            
        </div>
        </div>
    )
}

export default VotesToSkip;