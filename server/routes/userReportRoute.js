import express from "express";
import { authenticateUser, authenticateAdmin, authenticateWC } from "../middleware/auth.js";
import upload from "../config/multer.js"; // ✅

import { 
  getAllReports, 
  getReportById, 
  createReport, 
  updateReportAdmin, 
  updateReportWC, 
  deleteReport 
} from "../controllers/userReportController.js";

const router = express.Router();

router.get("/reports", authenticateAdmin, getAllReports);
router.get("/get-report/:id", authenticateUser, getReportById);
router.post("/create-report", authenticateUser, upload.single("attachment"), createReport);
router.put("/admin-update-report/:id", authenticateAdmin, updateReportAdmin);
router.put("/wc-update-report/:id", authenticateWC, updateReportWC);
router.delete("/delete-reports", authenticateAdmin, deleteReport);

export default router;
