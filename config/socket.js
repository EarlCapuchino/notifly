const socket = io => {
  io.on("connection", socket => {
    console.log(`connection established by: ${socket.id}`);

    socket.on("join_room", room => socket.join(room));

    socket.on("logout", roomId => socket.to(roomId).emit("logout"));

    socket.emit("me", socket.id);
  });
};

module.exports = socket;
