import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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

    return <div >  
        <form onSubmit={submitLink}>
            <input
                autoFocus
                value={link}
                placeholder="Enter youtube link"
                onChange={(e) => {
                    setLink(e.currentTarget.value);
                }}
                id="linkInput"
            />
        </form>
        <div>
            {
                showInputStatus ?
                <div>
                    { 
                        inputStatus ?
                        "Video added to queue! :D" :
                        "Not valid youtube URL. :/"
                    }
                </div>
                : ""
            }
        </div>
    </div>

}

export default LinkInput;