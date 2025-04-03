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
const authenticateUser = require('../middlewares/auth');
//get all report
router.get("/reports",  authenticateUser,getAllReports); 

//get report by id
router.get("/get-report/:id", authenticateUser,getReportById); 

//create report
router.post("/create-report", authenticateUser,createReport); 

//check if admin
const authorizeAdmin = (req, res, next) => {
  if (!req.isAdmin ) {
      return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};
//update report
router.put("/update-report/:id", authenticateUser,authorizeAdmin, updateReport); 

//check if waste collector
const authorizeWasteCollector = (req, res, next) => {
  if (!req.isWasteCollector) {

    return res.status(403).json({ msg: "Access denied. WasteCollectors only." });
  }
  next();
};
//update report
router.put("/wc-update-report/:id", authenticateUser,authorizeWasteCollector, updateReport); 


//delete report
router.delete("/:id", authenticateUser,deleteReport); 

export default router;
