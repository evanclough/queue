import React from "react";
import Axios from "axios";
import {Alert} from "reactstrap";
import { useReactOidc } from "@axa-fr/react-oidc-context";

const VideoInputForm: React.FunctionComponent = () => {
    const { oidcUser, logout } = useReactOidc();

    if (!oidcUser) return null;

    const {
        profile: { preferred_username },
    } = oidcUser;

    const [videoURL, setVideoURL] = React.useState<string>("");
    const [success, setSuccess] = React.useState<boolean>(false);
    const [visibleAlert, setVisibleAlert] = React.useState<boolean>(false);
    const [failureMessage, setFailureMessage] = React.useState<string>("");
    const onDismiss: VoidFunction = () => {
        setVisibleAlert(false);
    }

    const API_URL = "http://localhost:5000";
    
    const submitVideo: VoidFunction = () => {
        Axios.post(API_URL + "/add_video", {
            URL: videoURL,
            requester: preferred_username
        }).then(response => {
            setSuccess(response.data.success);
            if(!response.data.success){
                setFailureMessage(response.data.message);
            }
            setVisibleAlert(true);
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
            <Alert 
                color = {success ? "success" : "danger"} 
                isOpen = {visibleAlert}
                toggle = {onDismiss}
            >
                {success ? "Video succesfully added to queue!" : "Something went wrong: " + failureMessage}
            </Alert>
        </div>
    )
}

export default VideoInputForm;