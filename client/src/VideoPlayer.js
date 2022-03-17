import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const VideoPlayer = ({socket}) => {
    const [currentVideoID, setCurrentVideoID] = useState("-1");
    const [startPoint, setStartPoint] = useState(0);
    useEffect(() => {
        socket.on("switch_video", data => {
            console.log(data);
            setCurrentVideoID(data.videoID);
            setStartPoint(data.startPoint);
        })
    }, [socket]);

    return <>
        {currentVideoID == "-1" ? 
            "the queue is empty :(" :
            <iframe 
            width="560" 
            height="315" 
            src={`https://www.youtube.com/embed/${currentVideoID}?start=${startPoint}&autoplay=1`}
            title="YouTube video player"  
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            >
        </iframe>
        }
        
    </>
}

export default VideoPlayer