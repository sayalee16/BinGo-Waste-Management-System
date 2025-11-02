import { useState, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/authContext";

const UserReportForm = () => {
  const { currUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bin: "",
    user_id: currUser?.userId || currUser?._id || "", // Handle different user object structures
    status: "full",
    attachment: null,
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  console.log("Current User:", currUser); // Debug log

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Debug log
    setFormData({ ...formData, attachment: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: Please log in to perform this action.");
      return;
    }

    // Validate file
    if (!formData.attachment) {
      alert("Please attach an image file");
      return;
    }

    // Validate user_id
    const userId = currUser?.userId || currUser?._id;
    if (!userId) {
      alert("User ID not found. Please log in again.");
      console.error("User object:", currUser);
      return;
    }

    setIsSubmitting(true);

    const formDataToSend = new FormData();
    
    // Only append bin if it has a value
    if (formData.bin && formData.bin.trim() !== "") {
      formDataToSend.append("bin", formData.bin.trim());
    }
    
    formDataToSend.append("user_id", userId);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("attachment", formData.attachment);

    // Debug: Log what we're sending
    console.log("Submitting report with:");
    console.log("- bin:", formData.bin);
    console.log("- user_id:", userId);
    console.log("- status:", formData.status);
    console.log("- description:", formData.description);
    console.log("- attachment:", formData.attachment?.name);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/userreport/create-report`,
        {
          method: "POST",
          headers: {
            // DO NOT set Content-Type - let browser set it for FormData
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        console.error("Error response:", data);
        throw new Error(data.error || data.details || "Failed to submit the report");
      }

      console.log("Report submitted successfully:", data);
      alert("Report submitted successfully!");

      // Reset form - use null for attachment, not empty string
      setFormData({
        bin: "",
        user_id: userId,
        status: "full",
        attachment: null,
        description: "",
      });
      
      // Reset file input
      document.getElementById("file-upload").value = "";
      
    } catch (err) {
      console.error("Error submitting the report:", err);
      alert(`Failed to submit the report: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center bg-light-green-600 items-start min-h-screen pt-10 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/report.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-6 bg-white/90 shadow-xl rounded-2xl border border-green-300 backdrop-blur-md"
          style={{
            marginLeft: "-700px",
          }}
        >
          <motion.h2
            className="text-center text-2xl font-bold text-green-700 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            ♻️ Report Bin Status
          </motion.h2>

          {/* Form Fields */}
          <label className="block text-green-700 font-medium mb-1 text-sm">
            Bin ID (Optional):
          </label>
          <input
            type="text"
            name="bin"
            value={formData.bin}
            onChange={handleChange}
            // REMOVED required - make it optional
            placeholder="Enter Bin ID (leave empty for general complaint)"
            className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none mb-4 text-sm"
          />

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Status:
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none mb-4 text-sm"
          >
            <option value="full">Full</option>
            <option value="damaged">Damaged</option>
            <option value="needs maintenance">Needs Maintenance</option>
            <option value="partially filled">Partially Filled</option>
          </select>

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Attachment: <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full flex items-center mb-4">
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              required
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="p-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow cursor-pointer text-sm"
            >
              📎 Upload Image
            </label>
            {formData.attachment && (
              <span className="ml-3 text-xs text-gray-600 truncate max-w-[150px]">
                {formData.attachment.name}
              </span>
            )}
          </div>

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Description:
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide additional details..."
            className="w-full p-2 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none mb-5 text-sm resize-none"
            rows={3}
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-2 ${
              isSubmitting 
                ? "bg-gray-400 cursor-not-allowed" 
                : "bg-green-600 hover:bg-green-700"
            } text-white font-semibold rounded-lg shadow-md`}
          >
            {isSubmitting ? "Submitting..." : "🚀 Submit Report"}
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default UserReportForm;