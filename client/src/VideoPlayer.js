import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CurrentVideoHeader from './CurrentVideoHeader';
import VotesToSkip from './VoteToSkip';

const VideoPlayer = ({socket}) => {
    const [currentVideoID, setCurrentVideoID] = useState("-1");
    const [startPoint, setStartPoint] = useState(0);
    const [title, setTitle] = useState("")
    const [channelName, setChannelName] = useState("");
    const [channelUrl, setChannelUrl] = useState("");
    useEffect(() => {
        socket.on("switch_video", data => {
            setCurrentVideoID(data.videoID);
            setStartPoint(data.startPoint);
            setTitle(data.title);
            setChannelName(data.channelName);
            setChannelUrl(data.channelUrl);
        })
    }, [socket]);

    return (
        <div id="videoPlayerContainer" className='fullViewChild'>
            <div id="iframeContainer">
                {currentVideoID === "-1" ? 
                    <div id = "noVideoPlaceholder"> <h1>there are no videos to play :( </h1></div>:
                        <iframe 
                            width="100%"
                            height="100%" 
                            src={`https://www.youtube.com/embed/${currentVideoID}?start=${startPoint}&autoplay=1`}
                            title="YouTube video player"  
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        >
                        </iframe>
                }
            </div>
            <div id = "videoPlayerFooterContainer">
                <CurrentVideoHeader socket = {socket}/>
                <VotesToSkip socket = {socket}/>
            </div>
        </div>
    )
}

export default VideoPlayer