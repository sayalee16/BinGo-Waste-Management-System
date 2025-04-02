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
router.get("/reports", getAllReports); 

//get report by id
router.get("/get-report/:id", getReportById); 

//create report
router.post("/create-report", createReport); 


//update report
router.put("/:id", updateReport); 

//delete report
router.delete("/:id", deleteReport); 

export default router;
