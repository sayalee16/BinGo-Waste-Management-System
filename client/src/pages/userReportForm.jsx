import { useState } from "react";
import Navbar from "../components/Navbar";
import { AuthContext } from '../context/authContext'; // Importing AuthContext for user authentication
import { useContext } from 'react'; // Importing useContext to access context values

const UserReportForm = () => {
  const { currUser } = useContext(AuthContext); // Accessing current user from AuthContext
  console.log("Current User:", currUser); // Logging current user for debugging
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
  
    // Create a FormData object for file uploads
    const formDataToSend = new FormData();
    formDataToSend.append("bin", formData.bin);
    formDataToSend.append("user_id", currUser.userId); // Use currUser.userId instead of currUser
    formDataToSend.append("status", formData.status);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("attachment", formData.attachment); // Attach file
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/userreport/create-report`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            // ❌ Do NOT set Content-Type here, FormData sets it automatically
          },
          body: formDataToSend,
        }
      );
  
      if (!response.ok) {
        throw new Error("Failed to submit the report");
      }
  
      const data = await response.json();
      console.log("Report submitted successfully:", data);
      alert("Report submitted successfully!");
  
      // Clear form after successful submission
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
      <div className="flex justify-center items-start min-h-screen bg-green-50 pt-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-md w-full p-4 bg-white shadow-md rounded-xl border border-green-300"
        >
          <h2 className="text-center text-lg font-bold text-green-600 mb-4">
            Report Bin Status
          </h2>

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Bin ID:
          </label>
          <input
            type="text"
            name="bin"
            value={formData.bin}
            onChange={handleChange}
            required
            className="w-full p-1 border rounded-md focus:ring-2 focus:ring-green-400 mb-3 text-sm"
          />

          {/* <label className="block text-green-700 font-medium mb-1 text-sm">
            User ID:
          </label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full p-1 border rounded-md focus:ring-2 focus:ring-green-400 mb-3 text-sm"
          /> */}

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Status:
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            className="w-full p-1 border rounded-md focus:ring-2 focus:ring-green-400 mb-3 text-sm"
          >
            <option value="full">Full</option>
            <option value="damaged">Damaged</option>
            <option value="needs maintenance">Needs Maintenance</option>
            <option value="partially filled">Partially Filled</option>
          </select>

          <label className="block text-green-700 font-medium mb-1 text-sm">
            Attachment:
          </label>
          <div className="relative w-full flex items-center mb-3">
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
              className="p-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm text-center cursor-pointer transition duration-300 text-sm"
            >
              Choose File
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
            className="w-full p-1 border rounded-md focus:ring-2 focus:ring-green-400 mb-3 text-sm"
            placeholder="Provide additional details..."
          ></textarea>

          <button
            type="submit"
            className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm transition duration-300 text-sm"
          >
            Submit Report
          </button>
        </form>
      </div>
    </>
  );
};

export default UserReportForm;
