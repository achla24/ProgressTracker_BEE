import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import { socket } from "../../socket";

export default function Room() {
    const { roomId } = useParams();
    const [query] = useSearchParams();
    const username = query.get("username");

    const [users, setUsers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [typingUser, setTypingUser] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        socket.emit("join-room", { roomId, username });

        socket.on("room-users", (list) => setUsers(list));

        socket.on("receive-message", (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on("user-typing", (user) => {
            setTypingUser(user);
            setTimeout(() => setTypingUser(""), 1000);
        });

        return () => {
            socket.off("room-users");
            socket.off("receive-message");
            socket.off("user-typing");
        };
    }, []);

    const sendMessage = () => {
        socket.emit("send-message", { roomId, username, message });
        setMessage("");
    };

    const typing = () => {
        socket.emit("typing", { roomId, username });
    };

    return (
        <div>
            <h2>Room ID: {roomId}</h2>

            <h3>Participants</h3>
            {users.map((u) => (
                <p key={u.socketId}>🟢 {u.username}</p>
            ))}

            <div style={{ border: "1px solid black", height: 200, overflow: "auto" }}>
                {messages.map((m, i) => (
                    <p key={i}><b>{m.username}</b>: {m.message}</p>
                ))}
                {typingUser && <p><i>{typingUser} is typing...</i></p>}
            </div>

            <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={typing}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}
