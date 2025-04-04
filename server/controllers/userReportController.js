import UserReport from "../models/userReportModel.js";
import User from "../models/userModel.js";
export const createReport = async (req, res) => {
    try {
      const { bin, user_id, status, description } = req.body;
      const file = req.file;
  
      if (!file) {
        return res.status(400).json({ error: "Attachment is required" });
      }
  
      const newReport = new UserReport({
        bin,
        user_id,
        status,
        description,
        attachment: {
          data: file.buffer,
          contentType: file.mimetype,
        },
      });
  
      await newReport.save();
      res.status(201).json({ message: "Report created successfully", report: newReport });
    } catch (err) {
      console.error("Error in create-report:", err);
      res.status(500).json({ error: "Server error while submitting report" });
    }
  };
  

export const getAllReports = async (req, res) => {
    try {
        const userReports = await UserReport.find({
            status: { $in: ["full", "partially filled", "damaged", "needs maintenance"] },
        })
        .populate('user_id', 'name email location')
        .populate('bin', 'ward binType wc_status location');
    console.log(userReports);

        res.status(200).json(userReports);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch user reports", err: err.message });
    }
};

export const getReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const userReport = await UserReport.findById(id)
        .populate('user_id', 'name')  
        .populate('bin', 'location'); 
        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }
        res.status(200).json(userReport);
    } catch (err) {
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
        //find by id and update the reports
        const userReport = await UserReport.findByIdAndUpdate(id, { admin_status }, { new: true });
        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }
        //get the user who made report
        const user = await User.findById(userReport.user_id);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }
        //checks for report validation
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
        res.status(200).json({ msg: "User report updated", userReport });
    } catch (err) {
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
        res.status(500).json({ msg: "Failed to update user report", err: err.message });
    }
};

export const deleteReport = async (req, res) => {
    console.log("Received DELETE request"); // Debug log
    try {
        const deletedReports = await UserReport.deleteMany({ wc_status: "recycled" });

        if (deletedReports.deletedCount === 0) {
            console.log("No reports found to delete"); // Debug log
            return res.status(200).json({ msg: "No reports found to delete" });
        }

        res.status(200).json({ msg: "Reports deleted successfully", deletedCount: deletedReports.deletedCount });
    } catch (err) {
        console.error("Error deleting reports:", err);
        res.status(500).json({ msg: "Failed to delete reports", err: err.message });
    }
};

