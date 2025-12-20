import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinRoom() {
    const [roomId, setRoomId] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <h2>Join Study Room</h2>

            <input
                placeholder="Room ID"
                onChange={(e) => setRoomId(e.target.value)}
            />

            <input
                placeholder="Your Name"
                onChange={(e) => setUsername(e.target.value)}
            />

            <button
                onClick={() =>
                    navigate(`/studyroom/${roomId}?username=${username}`)
                }
            >
                Join
            </button>
        </div>
    );
}
