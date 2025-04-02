module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("updateStatus", async ({ id, status }) => {
      const Dustbin = require("../models/Dustbin");
      await Dustbin.findOneAndUpdate({ id }, { status });
      const bins = await Dustbin.find();
      io.emit("dustbinUpdate", bins);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};