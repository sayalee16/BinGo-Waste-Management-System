import express from "express";
import { authenticateAdmin, authenticateUser, authenticateWC } from "../middleware/auth.js"; 

const router = express.Router();
import { 
    getAllWasteBins, 
    getWasteBinById, 
    createWasteBin, 
    updateWasteBin, 
    deleteWasteBin,
    updateBinStatus,
    simulateBinCapacityChange,
    getAllWasteBinsFiltered,
    getAllWasteBinsSensor
} from "../controllers/wasteBinController.js";

///get for all valid users
router.get("/wastebins", getAllWasteBins); 

router.get("/wastebins-filtered", getAllWasteBinsFiltered); 

router.get("/wastebins-nosensor", getAllWasteBinsSensor); 

router.get("/wastebin/:id", authenticateUser, getWasteBinById);  

//create,update and delete only for admin
router.post("/create-wastebin", authenticateUser, createWasteBin); //remove authenticate user
router.put("/update-wastebin/:id", updateWasteBin);
router.delete("/delete-wastebin/:id", authenticateUser, deleteWasteBin);  

// Routes for bin status updates and simulations
router.post("/update-status", authenticateUser, updateBinStatus);
router.post("/simulate-update", simulateBinCapacityChange);

export default router;
