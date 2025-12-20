module.exports = function setupSocket(io){
    const rooms = {}  //rooms obj bnaya
    io.on("connection",(socket)=>{
        console.log("user connected: ",socket.id)
        socket.on("join-room",({roomId,username})=>{   //every room object has id and username
            socket.join(roomId)
            if(!rooms[roomId]) rooms[roomId] = []  //agr room exists nhi krta object main then make a new rooms object
            rooms[roomId].push({socketId : socket.id,username})

            io.to(roomId).emit("room-users",room[roomId])

            socket.to(roomId).emit("user-joined",username)
        })
        // Message
        socket.on("send-message", ({ roomId, username, message }) => {
            io.to(roomId).emit("receive-message", {
                username,
                message,
                time: new Date(),
            });
        });

        // Typing
        socket.on("typing", ({ roomId, username }) => {
            socket.to(roomId).emit("user-typing", username);
        });

        // Disconnect
        socket.on("disconnect", () => {
            for (const roomId in rooms) {
                rooms[roomId] = rooms[roomId].filter(
                    (u) => u.socketId !== socket.id
                );
                io.to(roomId).emit("room-users", rooms[roomId]);
            }
            console.log("User disconnected:", socket.id);
        });
    })
}