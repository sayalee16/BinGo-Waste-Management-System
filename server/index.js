import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoute.js"
import wasteBinRoutes from "./routes/wasteBinRoute.js";
import userReportRoutes from "./routes/userReportRoute.js"
import { Server } from 'socket.io'; //socket
import http from 'http'; //socket

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;
const server = http.createServer(app); //socket
const io = new Server(server, { 
	cors:{
			origin: "http://localhost:5173", // Your frontend URL
			methods: ["GET", "POST"],
	} 

}) //socket

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api/users", userRoutes);
app.use("/api/wastebin",wasteBinRoutes);
app.use("/api/userreport",userReportRoutes);

connectDB();

// Socket.IO setup
io.on("connection", (socket) => {
	console.log("A user connected");
  
	socket.on("disconnect", () => {
		console.log("User disconnected");
	});
});

// Export io for controllers
export  { app, server, io };

server.listen(port, () => {
	console.log(`Server running on port ${port}`);
});