import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    const createRoom = () => {
        const roomId = Math.random().toString(36).substring(2, 9);
        navigate(`/studyroom/${roomId}?username=${username}`);
    };

    return (
        <div>
            <h2>Create Study Room</h2>
            <input
                placeholder="Your Name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <button onClick={createRoom}>Create Room</button>
        </div>
    );
}
