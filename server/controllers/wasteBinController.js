import WasteBin from "../models/wasteBinModel.js";


export const createWasteBin = async (req, res) => {
    try {
        const wasteBin = new WasteBin(req.body);
        await wasteBin.save();
        res.status(201).json({ msg: "Wastebin created", wasteBin });
    } catch (err) {
        res.status(500).json({ msg: "Failed to create wastebin", err: err.message });
    }
};



export const getAllWasteBins = async (req, res) => {
    try {
        const bins = await WasteBin.find();
        res.status(200).json(bins);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch waste bins", err: err.message });
    }
};


export const getWasteBinById = async (req, res) => {
    try {
    	const { id } = req.params;
        const bin = await WasteBin.findById(id);
        if (!bin){
        	return res.status(404).json({ msg: "Waste bin not found" });
        }
        res.status(200).json(bin);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch waste bin", err: err.message });
    }
};


export const updateWasteBin = async (req, res) => {
    try {
        const { id } = req.params;
	const bin = await WasteBin.findByIdAndUpdate(id, req.body, { new: true });

        if (!bin) {
        	return res.status(404).json({ msg: "Waste bin not found" });
        }
        res.status(200).json({ msg: "Waste bin updated", bin });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update waste bin", err: err.message });
    }
};


export const deleteWasteBin = async (req, res) => {
    try {
    	const { id } = req.params;
        const bin = await WasteBin.findByIdAndDelete(id);
        if (!bin) {
        	return res.status(404).json({ msg: "Waste bin not found" });
        }
        res.status(200).json({ msg: "Waste bin deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete waste bin", err: err.message });
    }
};
