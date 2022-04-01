import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroupItem , ListGroup} from 'reactstrap';

const VideoInQueue = ({ID, index, title, channel_name, channel_url}) => {
    return (
        <ListGroupItem>
                    <img className="img-fluid thumbnailImg" src = {`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`} alt=""></img>
                    <span
                        className = "itemText"
                    >
                        <a href = {`https://youtube.com/watch?v=${ID}`}>
                            {title}
                        </a> by 
                        <a href={channel_url}> {channel_name}</a> 
                    </span>
        </ListGroupItem>
    )
}

export default VideoInQueue