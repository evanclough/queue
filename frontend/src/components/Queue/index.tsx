import React from "react";  
import Axios from "axios";
import {ListGroup, ListGroupItem} from "reactstrap";
import "./queue.css";


interface Video {
  URL: string;
  requester: string;
  thumbnail: string;
  title: string;
}

const Queue: React.FunctionComponent = () => {
    const defaultVideos: Video[] = [];

    const [videos, setVideos]: [Video[], (videos: Video[]) => void] = React.useState(defaultVideos);
    const [loading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);
    const [error, setError]: [string, (error: string) => void] = React.useState("");
    
    const API_URL: string = "http://localhost:5000";
    
    React.useEffect(() => {
        Axios.get<Video[]>(API_URL + "/get_videos", {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          },
        }).then(response => {
          setVideos(response.data);
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
      <div className="overflow-auto" id="queueContainer">
        <ListGroup>
          {videos.map((video, index) => (
              <ListGroupItem key={index} className="videoInQueue">
                <div>
                  <span>
                  <img src={video.thumbnail} className="queueThumbnail"></img>
                  </span>
                  <span className="videoTitle">
                  {index}. {video.title}
                  </span>
                </div> 
                <div className="requestedBy">
                  Requested by {video.requester} 
                </div>
              </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    );
  };
  
  export default Queue;