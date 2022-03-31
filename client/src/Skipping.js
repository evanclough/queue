import {useState, useEffect} from 'react';

const Skipping = ({socket}) => {
    const [showSkipping, setShowSkipping] = useState(false);

    useEffect(() => {
        socket.on("skipping", () => {
            setShowSkipping(true);
            setTimeout(() => setShowSkipping(false), 3000);
        })
    }, [socket]);

    return (
        <div id = 'skipping'>
            {showSkipping ? <h4> Skipping video... </h4>: ""}
        </div>
    )
}

export default Skipping;