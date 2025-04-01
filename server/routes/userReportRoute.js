import express from "express";

const router = express.Router();
import { 
  getAllReports, 
  getReportById, 
  createReport, 
  updateReport, 
  deleteReport 
} from "../controllers/userReportController.js";
//get all report
router.get("/", getAllReports); 

//get report by id
router.get("/:id", getReportById); 

//create report
router.post("/", createReport); 


//update report
router.put("/:id", updateReport); 

//delete report
router.delete("/:id", deleteReport); 

export default router;
