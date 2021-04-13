const http = require("http");
const app = require("./app");
const port = 3001;
const sever = http.createServer(app);
sever.listen(port);
const io = require("socket.io").listen(sever);
const Chat = require("./api/models/chat");
const mongoose = require("mongoose");

io.on("connection", (socket) => {
  console.log("a user connected ");

  socket.on("chat message", async (msg) => {
    try {
      let mes = msg[0];

      let message = new Chat({
        _id: mongoose.Types.ObjectId(),
        text: mes.text,
        user: mes.user._id,
      });
      await message.save();
      io.emit("chat message", msg);
    } catch (error) {
      io.emit("error", "Send fail");
    }
  });

  socket.on("disconnect", () => {
    io.emit("disconnect", "user disconnected");
  });
});
