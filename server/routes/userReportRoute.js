import express from "express";
import { authenticateUser,authenticateAdmin ,authenticateWC} from "../middleware/auth.js"; 
const router = express.Router();
import { 
  getAllReports, 
  getReportById, 
  createReport, 
  updateReportAdmin, 
  updateReportWC, 
  deleteReport 
} from "../controllers/userReportController.js";
//get all report
router.get("/reports",  authenticateAdmin,getAllReports); 

//get report by id
router.get("/get-report/:id", authenticateUser,getReportById); 

//create report
router.post("/create-report", authenticateUser,createReport); 

//update report 
router.put("/admin-update-report/:id",authenticateAdmin, updateReportAdmin); 

//update report
router.put("/wc-update-report/:id", authenticateWC, updateReportWC); 


//delete report
router.delete("/delete-reports", authenticateAdmin, deleteReport); 

export default router;
