import express from "express";
import { authenticateAdmin, authenticateUser } from "../middleware/auth.js"; 

const router = express.Router();
import { 
    getAllWasteBins, 
    getWasteBinById, 
    createWasteBin, 
    updateWasteBin, 
    deleteWasteBin,
    updateBinStatus,
    simulateBinCapacityChange,
    getAllWasteBinsFiltered
} from "../controllers/wasteBinController.js";

//check if admin
const authorizeAdmin = (req, res, next) => {
    if (!req.isAdmin) {
        return res.status(403).json({ msg: "Access denied. Admins only." });
    }
    next();
};

//get for all valid users
router.get("/wastebins", authenticateUser, getAllWasteBins); 

router.get("/wastebins-filtered", authenticateAdmin, getAllWasteBinsFiltered); 

 
router.get("/wastebin/:id", authenticateUser, getWasteBinById);  

//create,update and delete only for admin
router.post("/create-wastebin", authenticateUser, authorizeAdmin, createWasteBin); 
router.put("/update-wastebin/:id", authenticateUser, authorizeAdmin, updateWasteBin);
router.delete("/delete-wastebin/:id", authenticateUser, authorizeAdmin, deleteWasteBin);  

// Routes for bin status updates and simulations
router.post("/update-status", authenticateUser, updateBinStatus);
router.post("/simulate-update", simulateBinCapacityChange);

export default router;
