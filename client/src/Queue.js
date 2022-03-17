import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import VideoInQueue from './VideoInQueue';

const Queue = ({socket}) => {
    const [videos, setVideos] = useState([]);

    useEffect(() => {
        socket.on("current_videos", data => {
            setVideos(data.videos);
        })
        socket.on("add_video", data => {
            setVideos([...videos ,data.video]);
        })
    }, [socket, videos]);

    return (
        <div>
            Queue
            {videos.map((video, index) => (
                <VideoInQueue
                    key={index}
                    ID = {video.ID}
                    index = {index}
                />
            ))}
        </div>
    )

}

export default Queue;