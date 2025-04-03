import WasteBin from "../models/wasteBinModel.js";
import { io } from './../index.js';

// Define thresholds for different fill levels
const PARTIALLY_FILLED_THRESHOLD = 50; // 50% capacity
const FULLY_FILLED_THRESHOLD = 85;     // 85% capacity

export const updateBinStatus = async (req, res) => {
    try {
      const { id, realTimeCapacity } = req.body;
      const bin = await WasteBin.findOne({ id });
  
      if (!bin) return res.status(404).json({ message: "Bin not found" });
      
      // Store previous capacity to check if threshold was just crossed
      const previousCapacity = bin.realTimeCapacity;
      
      // Update bin data
      bin.realTimeCapacity = realTimeCapacity;
      
      // Determine bin status based on capacity
      if (realTimeCapacity >= FULLY_FILLED_THRESHOLD) {
        bin.status = "filled";
      } else if (realTimeCapacity >= PARTIALLY_FILLED_THRESHOLD) {
        bin.status = "partially filled";
      } else {
        bin.status = "normal";
      }
  
      await bin.save();
  
      // Check if bin just crossed a threshold
      const crossedFullThreshold = 
        previousCapacity < FULLY_FILLED_THRESHOLD && 
        realTimeCapacity >= FULLY_FILLED_THRESHOLD;
        
      const crossedPartialThreshold = 
        previousCapacity < PARTIALLY_FILLED_THRESHOLD && 
        realTimeCapacity >= PARTIALLY_FILLED_THRESHOLD;
  
      // Emit real-time notification to admins if bin status changed
      if (crossedFullThreshold) {
        emitBinAlert(bin, "FULLY FILLED");
      } else if (crossedPartialThreshold) {
        emitBinAlert(bin, "PARTIALLY FILLED");
      }
  
      res.json(bin);
    } catch (error) {
      console.error("Error updating bin status:", error);
      res.status(500).json({ error: error.message });
    }
};

// Helper function to emit bin alerts
function emitBinAlert(bin, alertType) {
  const alert = {
    id: bin._id,
    zone: bin.zone,
    ward: bin.ward,
    status: bin.status,
    realTimeCapacity: bin.realTimeCapacity,
    alertType: alertType,
    timestamp: new Date(),
    message: `⚠️ Bin ${bin._id} in ${bin.ward}, Zone ${bin.zone} is now ${alertType} (${bin.realTimeCapacity}%)!`
  };
  
  io.emit("binAlert", alert);
  console.log(`🚀 ${alertType} alert emitted for bin: ${bin._id}`);
  
  // You could also store alerts in a database for history
  // saveAlertToDatabase(alert);
} 

// Function to manually trigger capacity updates (for testing dummy data)
export const simulateBinCapacityChange = async (req, res) => {
    try {
      const { binId, newCapacity } = req.body;
      
      if (!binId || newCapacity === undefined) {
        return res.status(400).json({ message: "Both binId and newCapacity are required" });
      }
      
      const bin = await WasteBin.findById(binId);
      if (!bin) return res.status(404).json({ message: "Bin not found" });
      
      // Call updateBinStatus internally
      await updateBinStatus({
        body: { id: binId, realTimeCapacity: newCapacity }
      }, res);
      
    } catch (error) {
      console.error("Error simulating bin capacity change:", error);
      res.status(500).json({ error: error.message });
    }
  }; //socket end

// Create a new waste bin (with complete field validation)

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
        res.status(500).json({ msg: "Failed to fetch waste bins", error: err.message });
    }
};

export const getAllWasteBinsFiltered = async (req, res) => {
  try {
      const bins = await WasteBin.find({
          status: { $in: ["filled"] }
      });
      res.status(200).json(bins);
  } catch (err) {
      res.status(500).json({ msg: "Failed to fetch waste bins", error: err.message });
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
