import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

const VideoInQueue = ({ID, index, title, channel_name, channel_url}) => {
    return (
        <div className = 'videoInQueue'>
            <span className="indexInQueue">
                <b>{index+1}</b>  
            </span>
            <img className="imageInVideoInQueue" src = {`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`} alt=""></img>
            <span className="titleInVideoInQueue">
                <a href={`https://youtube.com/watch?v=${ID}`}>
                    {title}
                </a>
            </span>
        </div>
    )
}

export default VideoInQueue