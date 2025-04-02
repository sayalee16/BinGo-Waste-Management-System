import express from "express";
const router = express.Router();
import {login, register} from "../controllers/userController.js";

router.post("/login", login);
// router.post("/register", (req, res) => {
//   console.log("Register route hit!");
//   res.json({ message: "Route is working!" });
// });

router.post("/register",register);

export default router;