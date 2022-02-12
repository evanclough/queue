import React from "react";
import Axios from "axios";

interface Video {
    URL: string;
    timestamp: number;
}

const VideoPlayer: React.FunctionComponent = () => {
    const defaultVideo: Video = {URL: "l", timestamp: 123};
    const [currentVideo, setCurrentVideo] = React.useState<Video>(defaultVideo);
    const [isEmpty, setEmpty] = React.useState<boolean>(true);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");
    
    const API_URL: string = "http://localhost:5000";
    
    React.useEffect(() => {
        Axios.get<Video>(API_URL + "/get_current_video", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        }).then(response => {
            console.log(response)
            if(response.data.timestamp != -1){
                setCurrentVideo(response.data);
                setEmpty(false)
            }else{
                setEmpty(true)
            }
        }).catch(ex => {
          const error =
          ex.response.status === 404
            ? "Resource Not found"
            : "An unexpected error has occurred";
          setError(error);
          setLoading(false);
        });
    }, [])

    return (
        <div id="videoInputContainer">
            { isEmpty ? 
            "no video queued :/" :
            <iframe 
                width="560" 
                height="315" 
                src={"https://www.youtube.com/embed/" + currentVideo.URL + "?start=" + currentVideo.timestamp}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                >

            </iframe>
            }
        </div>
    )
}

export default VideoPlayer;