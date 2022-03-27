import 'bootstrap/dist/css/bootstrap.min.css';
import {useState, useEffect} from 'react';
import axios from 'axios';

const VideoInQueue = ({ID, index}) => {
    const [title, setTitle] = useState("");

    useEffect(() => {
        axios.get(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${ID}`)
        .then(data => {
            setTitle(data.data.title);
        })
        .catch(err => {
            setTitle("couldn't get title");
        })
    }, [])

    return (
        <div className = 'videoInQueue'>
            {index} {"   "}   
            <img className="fuckoff" src = {`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`} alt=""></img>
            {title}
        </div>
    )
}

export default VideoInQueue