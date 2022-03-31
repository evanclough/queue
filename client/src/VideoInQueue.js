import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroupItem } from 'reactstrap';

const VideoInQueue = ({ID, index, title, channel_name, channel_url}) => {
    return (
        <ListGroupItem>
            <img className="imageInVideoInQueue" src = {`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`} alt=""></img>
            <a href = {`https://youtube.com/watch?v=${ID}`}>{title}</a> by <a href={channel_url}>{channel_name}</a>
        </ListGroupItem>
    )
}

export default VideoInQueue