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
            setVideos([...videos, data.video]);
        })
        socket.on("dequeue", () => {
            setVideos(videos.filter((video, idx) => idx !== 0));
        })
    }, [socket, videos]);

    return (
        <div id = "queue">
            <div id="queueHeader">            
                 <h4>Queue: {videos.length === 0 ? "empty :(" :  ""} </h4>
            </div>
            {videos.map((video, index) => (
                <VideoInQueue
                    key= {index}
                    ID = {video.ID}
                    title={video.title}
                    channel_name={video.author_name}
                    channel_url={video.author_url}
                    index = {index}
                />
            ))}
            <div id="queueFooter">            
                 <h4>{videos.length === 0 ? "" :  "the end!"} </h4>
            </div>
        </div>
    )

}

export default Queue;