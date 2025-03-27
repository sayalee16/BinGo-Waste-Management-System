import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import userRoutes from "./routes/userRoute.js"

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

app.get("/", (req, res) => {
	res.send("Hello World");
});

app.use("/api/user", userRoutes);

connectDB();

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});