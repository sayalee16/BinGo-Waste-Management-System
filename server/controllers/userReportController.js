import UserReport from "../models/userReportModel.js";
import User from "../models/userModel.js";
import WasteBin from "../models/wasteBinModel.js"; // Import WasteBin model
import mongoose from "mongoose"; 

export const createReport = async (req, res) => {
    try {
      console.log("=== CREATE REPORT DEBUG ===");
      console.log("Request body:", req.body);
      console.log("Request file:", req.file ? {
        fieldname: req.file.fieldname,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : "No file");
      
      const { bin, user_id, status, description } = req.body;
      const file = req.file;
  
      // Validate file
      if (!file) {
        console.log("ERROR: No file attached");
        return res.status(400).json({ error: "Attachment is required" });
      }

      // Validate user_id
      if (!user_id) {
        console.log("ERROR: No user_id provided");
        return res.status(400).json({ error: "User ID is required" });
      }

      // Validate user_id format (should be MongoDB ObjectId)
      if (!mongoose.Types.ObjectId.isValid(user_id)) {
        console.log("ERROR: Invalid user_id format:", user_id);
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      // Clean bin value
      let cleanBin = null;
      if (bin && typeof bin === 'string' && bin.trim() !== '') {
        cleanBin = bin.replace(/^["']|["']$/g, '').trim();
        console.log("Cleaned bin:", cleanBin);
      }
  
      const newReport = new UserReport({
        bin: cleanBin,
        user_id,
        status: status || undefined,
        description: description || undefined,
        attachment: {
          data: file.buffer,
          contentType: file.mimetype,
        },
      });

      console.log("Attempting to save report...");
      await newReport.save();
      console.log("✓ Report saved successfully");
      
      res.status(201).json({ message: "Report created successfully", report: newReport });
    } catch (err) {
      console.error("❌ Error in create-report:", err);
      
      // Handle specific validation errors
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({ 
          error: "Validation failed",
          details: messages.join(', ')
        });
      }
      
      res.status(500).json({ 
        error: "Server error while submitting report",
        details: err.message
      });
    }
};

export const getAllReports = async (req, res) => {
    try {
        // First, get reports with user population only
        const userReports = await UserReport.find({
            status: { $in: ["full", "partially filled", "damaged", "needs maintenance"] },
        })
        .populate('user_id', 'name email location'); // Only populate user_id (ObjectId)
        // Remove .populate('bin') - it's a string, not an ObjectId

        console.log("Fetched reports:", userReports.length);

        // Manually fetch bin details for each report
        const reportsWithBins = await Promise.all(
            userReports.map(async (report) => {
                const reportObj = report.toObject();
                
                if (reportObj.bin) {
                    try {
                        // Find bin by its string ID (UUID)
                        const bin = await WasteBin.findById(reportObj.bin);
                        
                        if (bin) {
                            reportObj.bin = {
                                _id: bin._id,
                                ward: bin.ward,
                                binType: bin.binType,
                                wc_status: bin.wc_status,
                                location: bin.location
                            };
                        } else {
                            // Bin not found, keep the UUID
                            reportObj.bin = {
                                _id: reportObj.bin,
                                ward: 'Unknown',
                                binType: 'Unknown',
                                wc_status: 'Unknown',
                                location: null
                            };
                        }
                    } catch (error) {
                        console.error(`Error fetching bin ${reportObj.bin}:`, error);
                        reportObj.bin = {
                            _id: reportObj.bin,
                            ward: 'Unknown',
                            binType: 'Unknown',
                            wc_status: 'Unknown',
                            location: null
                        };
                    }
                }
                
                return reportObj;
            })
        );

        console.log("Reports with bins populated:", reportsWithBins);
        res.status(200).json(reportsWithBins);
    } catch (err) {
        console.error("Error in getAllReports:", err);
        res.status(500).json({ msg: "Failed to fetch user reports", err: err.message });
    }
};

export const changeAllReports = async (req, res) => {
    try {
        const { wc_status } = req.body;

        if (!wc_status) {
            return res.status(400).json({ msg: "wc_status is required in the request body" });
        }

        const result = await UserReport.updateMany(
            { wc_status: "pending" },
            { status: "recycled", wc_status: "recycled" }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ msg: "No reports matched the filter criteria" });
        }

        console.log("Reports updated:", result);
        res.status(200).json({ msg: "Reports updated successfully", result });
    } catch (err) {
        console.error("Error updating reports:", err);
        res.status(500).json({ msg: "Failed to update reports", err: err.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const userReport = await UserReport.findById(id)
            .populate('user_id', 'name'); // Only populate user_id
        
        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }

        // Manually fetch bin details
        const reportObj = userReport.toObject();
        if (reportObj.bin) {
            try {
                const bin = await WasteBin.findById(reportObj.bin);
                if (bin) {
                    reportObj.bin = {
                        _id: bin._id,
                        location: bin.location,
                        ward: bin.ward
                    };
                }
            } catch (error) {
                console.error(`Error fetching bin:`, error);
            }
        }

        res.status(200).json(reportObj);
    } catch (err) {
        console.error("Error in getReportById:", err);
        res.status(500).json({ msg: "Failed to fetch user report", err: err.message });
    }
};

export const updateReportAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        const { admin_status } = req.body;

        if (!["pending", "approved", "rejected"].includes(admin_status)) {
            return res.status(400).json({ msg: "Invalid admin_status value" });
        }

        const userReport = await UserReport.findByIdAndUpdate(id, { admin_status }, { new: true });
        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }

        const user = await User.findById(userReport.user_id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (admin_status === "rejected") {
            if (user.points > 0) {
                user.points -= 1;
            }
            if (user.points === 0) {
                user.blacklisted = true;
            }
        } else if (admin_status === "approved") {
            user.points += 1;
            user.blacklisted = false; 
        }
        
        await user.save();
        res.status(200).json({ msg: "User report updated", userReport, user });
    } catch (err) {
        console.error("Error in updateReportAdmin:", err);
        res.status(500).json({ msg: "Failed to update user report", err: err.message });
    }
};

export const updateReportWC = async (req, res) => {
    try {
        const { id } = req.params;

        if (req.body.wc_status && !["pending", "done"].includes(req.body.wc_status)) {
            return res.status(400).json({ msg: "Invalid wc_status value" });
        }
        
        const userReport = await UserReport.findByIdAndUpdate(id, req.body, { new: true });

        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }
        
        res.status(200).json({ msg: "User report updated", userReport });
    } catch (err) {
        console.error("Error in updateReportWC:", err);
        res.status(500).json({ msg: "Failed to update user report", err: err.message });
    }
};

export const deleteReport = async (req, res) => {
    console.log("Received DELETE request");
    try {
        const deletedReports = await UserReport.deleteMany({ wc_status: "recycled" });

        if (deletedReports.deletedCount === 0) {
            console.log("No reports found to delete");
            return res.status(200).json({ msg: "No reports found to delete" });
        }

        res.status(200).json({ msg: "Reports deleted successfully", deletedCount: deletedReports.deletedCount });
    } catch (err) {
        console.error("Error deleting reports:", err);
        res.status(500).json({ msg: "Failed to delete reports", err: err.message });
    }
};