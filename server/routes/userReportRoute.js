import express from "express";
import { authenticateUser } from "../middleware/auth.js"; 
const router = express.Router();
import { 
  getAllReports, 
  getReportById, 
  createReport, 
  updateReport, 
  deleteReport 
} from "../controllers/userReportController.js";
//get all report

router.get("/reports", authenticateUser, getAllReports); 

//get report by id
router.get("/get-report/:id", authenticateUser, getReportById); 

//create report
router.post("/create-report", authenticateUser, createReport); 


//update report
router.put("update-report/:id", authenticateUser, updateReport); 

//delete report
router.delete("delete-report/:id", authenticateUser, deleteReport); 

export default router;
