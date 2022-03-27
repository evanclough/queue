import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VideoPlayer = ({socket}) => {
    const [currentVideoID, setCurrentVideoID] = useState("-1");
    const [startPoint, setStartPoint] = useState(0);
    useEffect(() => {
        socket.on("switch_video", data => {
            setCurrentVideoID(data.videoID);
            setStartPoint(data.startPoint);
        })
    }, [socket]);

    return <div id="videoPlayer">
        {currentVideoID === "-1" ? 
            <h4> the queue is empty :( </h4>:
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
}

export default VideoPlayer