import express from "express";

const router = express.Router();
import { 
    getAllWasteBins, 
    getWasteBinById, 
    createWasteBin, 
    updateWasteBin, 
    deleteWasteBin 
} from "../controllers/wasteBinController.js";


//get all wastebins
router.get("/", getAllWasteBins); 

//get wastebin by id
router.get("/:id", getWasteBinById); 

//create wastebin
router.post("/", createWasteBin); 

//update wastebin
router.put("/:id", updateWasteBin); 
//delete bin
router.delete("/:id", deleteWasteBin); 

export default router;
