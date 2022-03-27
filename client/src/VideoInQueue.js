import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

const VideoInQueue = ({ID, index, title, channel_name, channel_url}) => {
    return (
        <div className = 'videoInQueue'>
            <span className="indexInQueue">
                {index} {"   "}   
            </span>
            <img className="imageInVideoInQueue" src = {`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`} alt=""></img>
            <span className="titleInVideoInQueue">
                {title}
            </span>
        </div>
    )
}

export default VideoInQueue