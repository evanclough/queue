import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import VideoInQueue from './VideoInQueue';

const Queue = ({socket}) => {
    const [videos, setVideos] = useState([]);
    
    useEffect(() => {
        socket.on("current_videos", data => {
            setVideos(data.videos);
        })
    }, [socket])

    return (
        <div>
            Queue
            {videos.map((video, index) => {
                <VideoInQueue
                    ID = {video.ID}
                    index = {index}
                />
            })}
        </div>
    )

}

export default Queue;