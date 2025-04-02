import WasteBin from "../models/wasteBinModel.js";

// Create a new waste bin (with complete field validation)
export const createWasteBin = async (req, res) => {
    try {
        const {totalCapacity,realTimeCapacity,approxTimeToFill,lastEmptiedAt,location,binType,category,status,sensorEnabled,ward,zone} = req.body;

        if (
            totalCapacity === undefined || 
            realTimeCapacity === undefined || 
            approxTimeToFill === undefined || 
            !lastEmptiedAt || 
            !location || 
            !location.type || 
            !location.coordinates || 
            !category || 
            !status || 
            sensorEnabled === undefined || 
            !ward || 
            !zone
        ) {
            return res.status(400).json({ msg: "Missing required fields" });
        }

       //check location format
        if (!location.type || location.type !== "Point" || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
            return res.status(400).json({ msg: "Invalid location format. Must have type: 'Point' and coordinates: [longitude, latitude]" });
        }

        const wasteBin = new WasteBin({totalCapacity,realTimeCapacity,approxTimeToFill,lastEmptiedAt,
            location: {
                type: "Point",
                coordinates: location.coordinates
            },binType,category,status,sensorEnabled,ward,zone
        });

        await wasteBin.save();
        res.status(201).json({ msg: "Waste bin created successfully", wasteBin });

    } catch (err) {
        res.status(500).json({ msg: "Failed to create waste bin", error: err.message });
    }
};

// Get all waste bins
export const getAllWasteBins = async (req, res) => {
    try {
        const bins = await WasteBin.find();
        res.status(200).json(bins);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch waste bins", error: err.message });
    }
};

// Get waste bin by ID
export const getWasteBinById = async (req, res) => {
    try {
        const { id } = req.params;
        const bin = await WasteBin.findById(id);
        
        if (!bin) {
            return res.status(404).json({ msg: "Waste bin not found" });
        }
        
        res.status(200).json(bin);
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch waste bin", error: err.message });
    }
};

// Update waste bin
export const updateWasteBin = async (req, res) => {
    try {
        const { id } = req.params;
        const updateFields = req.body;

        // Check location format if provided
        if (updateFields.location) {
            const { location } = updateFields;
            
            // Check location format
            if (!location.type || location.type !== "Point" || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
                return res.status(400).json({ msg: "Invalid location format. Must have type: 'Point' and coordinates: [longitude, latitude]" });
            }
        }

        const updatedBin = await WasteBin.findByIdAndUpdate(id, updateFields, { new: true });

        if (!updatedBin) {
            return res.status(404).json({ msg: "Waste bin not found" });
        }

        res.status(200).json({ msg: "Waste bin updated successfully", updatedBin });
    } catch (err) {
        res.status(500).json({ msg: "Failed to update waste bin", error: err.message });
    }
};


// Delete waste bin
export const deleteWasteBin = async (req, res) => {
    try {
        const { id } = req.params;
        const bin = await WasteBin.findByIdAndDelete(id);

        if (!bin) {
            return res.status(404).json({ msg: "Waste bin not found" });
        }

        res.status(200).json({ msg: "Waste bin deleted successfully" });
    } catch (err) {
        res.status(500).json({ msg: "Failed to delete waste bin", error: err.message });
    }
};
