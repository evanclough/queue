import React from "react";
import Axios from "axios";
import { useReactOidc } from "@axa-fr/react-oidc-context";

const VideoInputForm: React.FunctionComponent = () => {
    const { oidcUser, logout } = useReactOidc();

    if (!oidcUser) return null;

    const {
        profile: { preferred_username },
    } = oidcUser;

    const [videoURL, setVideoURL]: [string, (video: string) => void] = React.useState("");
    
    const API_URL = "http://localhost:5000";
    
    const submitVideo: VoidFunction = () => {
        Axios.post(API_URL + "/add_video", {
            URL: videoURL,
            requester: preferred_username
        }).then(response => {
            console.log(response);
        })
    }

    return (
        <div id="VideoInputForm">
            <input 
                value={videoURL}
                onChange={e => setVideoURL(e.target.value)}
            />
            <button
                onClick={submitVideo}
            >
                Submit Video
            </button>
        </div>
    )
}

export default VideoInputForm;