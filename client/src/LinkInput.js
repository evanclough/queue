import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ListGroup, ListGroupItem, Alert} from 'reactstrap';

const LinkInput = ({socket}) => {
    const [showInputStatus, setShowInputStatus] = useState(false);
    const [inputStatus, setInputStatus] = useState(false);
    const [link, setLink] = useState("");
    useEffect(() => {
        socket.on("input_status", data => {
            setInputStatus(data.success);
            setShowInputStatus(true);
            setTimeout(() => setShowInputStatus(false), 5000);
        })
    }, [socket])

    const submitLink = e => {
        e.preventDefault();
        socket.emit("link_input", {link: link});
        setLink("");
    }

    return (
        <ListGroup>
            <ListGroupItem>
                Queue
            </ListGroupItem>
            <ListGroupItem>
                <form onSubmit={submitLink}>
                    <input
                        className="w-100"
                        autoFocus
                        value={link}
                        placeholder={ 
                            showInputStatus ? 
                                inputStatus ?
                                "Video added to queue! :D" :
                                "Not valid youtube URL. :/"
                            :
                                "Enter a youtube link!"
                            }
                        onChange={(e) => {  
                            setLink(e.currentTarget.value);
                        }}
                    />
                </form>
            </ListGroupItem>
        </ListGroup>
    )

}

export default LinkInput;