import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const HOST_URL = 'localhost:5000';

const CreateRoomInput = ({socket}) => {
    const [showInputStatus, setShowInputStatus] = useState(false);
    const [inputStatus, setInputStatus] = useState(false);
    const [roomName, setRoomName] = useState("");

    const submitRoom = e => {
        e.preventDefault();
        axios.post(`http://${HOST_URL}/create_room`, {room: roomName})
        .then(response => {
            if(response.data.success){
                setInputStatus(true);
                setShowInputStatus(true);
                setTimeout(() => setShowInputStatus(false), 5000);
            }else{
                setInputStatus(false);
                setShowInputStatus(true);
                setTimeout(() => setShowInputStatus(false), 5000);
            }
        })
        setRoomName("");
    }

    return <div>  
        <form onSubmit={submitRoom}>
            <input
                autoFocus
                value={roomName}
                placeholder="Enter the name of the room you'd like to create"
                onChange={(e) => {
                    setRoomName(e.currentTarget.value);
                }}
            />
        </form>
        <div>
            {
                showInputStatus ?
                <div>
                    { 
                        inputStatus ?
                        "Successfully made room!!! :D" :
                        "couldn't make room :/"
                    }
                </div>
                : ""
            }
        </div>
    </div>

}

export default CreateRoomInput;