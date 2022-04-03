import {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

const HOST_URL = 'localhost:5000'

const FindRoomInput = ({setRoomVisible, setCurrentRoom}) => {
    const [showInputStatus, setShowInputStatus] = useState(false);
    const [inputStatus, setInputStatus] = useState(false);
    const [room, setRoom] = useState("");

    const submitRoom = e => {
        e.preventDefault();
        axios.post(`http://${HOST_URL}/check_if_valid_room`, {room: room})
        .then(response => {
            if(response.data.roomExists){
                setCurrentRoom(room);
                setRoom("");
                setRoomVisible();
            }else{
                setInputStatus(false);
                setShowInputStatus(true);
                setTimeout(() => setShowInputStatus(false), 5000);
                setRoom("");
            }
        })
    }

    return (
        <div className="homepageChild">  
        <div id = "findRoomInput">
            <form onSubmit={submitRoom}>
                <input
                    autoFocus
                    value={room}
                    placeholder="Enter the name of the room you'd like to join!"
                    onChange={(e) => {
                        setRoom(e.currentTarget.value);
                    }}
                    id="actualFindRoomInput"
                />
            </form>
            <div>
                {
                    showInputStatus ?
                    <div>
                        { 
                            inputStatus ?
                            "Joining room!" :
                            "Not valid room... :/"
                        }
                    </div>
                    : ""
                }
            </div>
            </div>
        </div>
    )

}

export default FindRoomInput;