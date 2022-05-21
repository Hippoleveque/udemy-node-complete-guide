import { Server } from "socket.io";
let io;

export const initSocket = (server) => {
  io = new Server(server, { cors: { origin: "*" } });
  return io;
};

export const getIo = () => {
  if (!io) {
    throw new Error("Socket does not exist");
  }
  return io;
};
