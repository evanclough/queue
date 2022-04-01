import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import VideoInQueue from './VideoInQueue';
import { ListGroup} from 'reactstrap';
import LinkInput from './LinkInput';
import Videos from './Videos';

const Queue = ({socket, fullView}) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        socket.on("current_videos", data => {
            setVideos(data.videos);
        })
        socket.on("add_video", data => {
            setVideos([...videos, data.video]);
        })
        socket.on("dequeue", () => {
            setVideos(videos.filter((video, idx) => idx !== 0));
        })
    }, [socket, videos]);

    return (
        <div id={fullView ? "queueContainer" : "queueContainerSolo"}className={fullView ? "fullViewChild" : ""}> 
            <div id = "linkInputContainer">
                <LinkInput socket={socket} fullView={fullView}/>
            </div>        
            <div id = "videosContainer">
                <Videos socket={socket}/>
            </div>
        </div>
    )

}

export default Queue;