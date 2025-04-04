import { useState, useContext } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/authContext";

const UserReportForm = () => {
  const { currUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    bin: "",
    user_id: currUser.userId,
    status: "full",
    attachment: null,
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachment: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Unauthorized: Please log in to perform this action.");
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("bin", formData.bin);
    formDataToSend.append("user_id", currUser.userId);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("attachment", formData.attachment);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/userreport/create-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) throw new Error("Failed to submit the report");

      const data = await response.json();
      console.log("Report submitted successfully:", data);
      alert("Report submitted successfully!");

      setFormData({
        bin: "",
        user_id: currUser.userId,
        status: "full",
        attachment: "",
        description: "",
      });
    } catch (err) {
      console.error("Error submitting the report:", err);
      alert("Failed to submit the report. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="flex justify-center items-start min-h-screen pt-10 px-4 bg-cover bg-center"
        style={{
          backgroundImage: "url('/report.webp')", // Ensure the path is correct
          backgroundSize: "cover", // Ensures the image covers the entire screen
          backgroundPosition: "center", // Centers the image
          backgroundRepeat: "no-repeat", // Prevents the image from repeating
        }}
      >
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }} // Slight animation from the right
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md p-6 bg-white/90 shadow-xl rounded-2xl border border-green-300 backdrop-blur-md"
          style={{
            marginLeft: "-700px", // Increased negative margin to move the form further to the left
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
            Bin ID:
          </label>
          <input
            type="text"
            name="bin"
            value={formData.bin}
            onChange={handleChange}
            required
            placeholder="Enter Bin ID"
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
            Attachment:
          </label>
          <div className="relative w-full flex items-center mb-4">
            <input
              type="file"
              name="attachment"
              onChange={handleFileChange}
              required
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="p-2 px-4 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-md shadow cursor-pointer text-sm"
            >
              📎 Upload File
            </label>
            {formData.attachment && (
              <span className="ml-3 text-xs text-gray-600 truncate">
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
            className="w-full p-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
          >
            🚀 Submit Report
          </motion.button>
        </motion.form>
      </div>
    </>
  );
};

export default UserReportForm;
