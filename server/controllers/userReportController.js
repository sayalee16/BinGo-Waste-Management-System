import UserReport from "../models/userReportModel.js";
import mongoose from "mongoose";

export const createReport = async (req, res) => {
    try {
        const { bin, user_id, status, attachment, description } = req.body;

        
        if (!bin || !user_id || !status || !attachment) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

       

        const validStatuses = ["full", "damaged", "needs maintenance", "partially filled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ 
                msg: "Invalid status", 
                validStatuses: validStatuses 
            });
        }

        const userReport = new UserReport({
            bin,
            user_id,
            status,
            attachment,
            description: description || undefined
        });

        await userReport.save();
        res.status(201).json({ 
            success: true,
            msg: "Report created successfully",
            data: userReport 
        });

    } catch (err) {
        res.status(500).json({ msg: "Failed to create user report", err: err.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const userReports = await UserReport.find()
        .populate({
            path: 'user_id',  
            select: 'name',
            model: 'User'
        })
        .populate({
            path: 'bin',      
            select: 'location', 
            model: 'WasteBin'  
          });
    
        
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

export const updateReport = async (req, res) => {
    try {
        const { id } = req.params;
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
    try {
        const { id } = req.params;
        const userReport = await UserReport.findByIdAndDelete(id);
        if (!userReport) {
            return res.status(404).json({ msg: "User report not found" });
        }
        res.status(200).json({ msg: "User report deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete user report", err: err.message });
    }
};