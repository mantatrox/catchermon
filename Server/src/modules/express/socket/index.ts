import http from "http";
import socketio from "socket.io";

let io: socketio.Server | undefined = undefined;

function bindEvents() {
  if (!io) return;

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on("join", (roomCode: string) => {
      socket.join(roomCode);
      console.log(`${socket.id} joined ${roomCode}`);
    });
  });
}

function emitChange(pageId: string, entityId: string) {
  if (!io) return;

  io.to(pageId).emit("refresh", entityId);
}

function serve(server: http.Server, port: number) {
  io = socketio(server, { origins: "*:*" });
  bindEvents();

  server.listen(port, () => {
    console.log("Champ, your server is running! Port:", port);
  });
}

export { serve, emitChange };
