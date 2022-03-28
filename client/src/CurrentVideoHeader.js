import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const CurrentVideoHeader = ({socket}) => {
    const [currentVideoID, setCurrentVideoID] = useState("-1");
    const [title, setTitle] = useState("")
    const [channelName, setChannelName] = useState("");
    const [channelUrl, setChannelUrl] = useState("");
    useEffect(() => {
        socket.on("switch_video", data => {
            setCurrentVideoID(data.videoID);
            setTitle(data.title);
            setChannelName(data.channelName);
            setChannelUrl(data.channelUrl);
        })
    }, [socket]);

    return <div id="currentVideoInfo">
        {currentVideoID === "-1" ? 
            <p> the queue is empty :( </p>:
            <p> Current Video:{" "} 
                <a href={`https://www.youtube.com/watch?v=${currentVideoID}`}>{title} </a>
                by <a href={channelUrl}>{channelName}</a>
            </p>
        }
        
    </div>
}

export default CurrentVideoHeader;