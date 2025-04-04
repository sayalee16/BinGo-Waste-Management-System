import { useState } from "react";

const UserReportForm = () => {
  const [formData, setFormData] = useState({
    bin: "",
    user_id: "",
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
    const token = localStorage.getItem("token");
    e.preventDefault();
    
    if (!token) {
      setError("Unauthorized: Please log in to perform this action.");
      return;
    }
    // Create a FormData object
    const formDataToSend = new FormData();
    formDataToSend.append("bin", formData.bin);
    formDataToSend.append("user_id", formData.user_id);
    formDataToSend.append("status", formData.status);
    formDataToSend.append("attachment", formData.attachment); // Add the file
    formDataToSend.append("description", formData.description);
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/create-report`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Do NOT set "Content-Type" when using FormData — browser sets it correctly
        },
        body: formDataToSend, // Send FormData
      });
  
      if (!response.ok) {
        throw new Error("Failed to submit the report");
      }
  
      const data = await response.json();
      console.log("Report submitted successfully:", data);
      alert("Report submitted successfully!");
    } catch (err) {
      console.error("Error submitting the report:", err);
      alert("Failed to submit the report. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <label className="block mb-2">Bin ID:</label>
      <input type="text" name="bin" value={formData.bin} onChange={handleChange} required className="w-full p-2 border rounded mb-4" />
      
      <label className="block mb-2">User ID:</label>
      <input type="text" name="user_id" value={formData.user_id} onChange={handleChange} required className="w-full p-2 border rounded mb-4" />
      
      <label className="block mb-2">Status:</label>
      <select name="status" value={formData.status} onChange={handleChange} required className="w-full p-2 border rounded mb-4">
        <option value="full">Full</option>
        <option value="damaged">Damaged</option>
        <option value="needs maintenance">Needs Maintenance</option>
        <option value="partially filled">Partially Filled</option>
      </select>
      
      <label className="block mb-2">Attachment:</label>
      <input type="file" name="attachment" onChange={handleFileChange} required className="w-full p-2 border rounded mb-4" />
      
      <label className="block mb-2">Description:</label>
      <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded mb-4"></textarea>
      
      <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Submit</button>
    </form>
  );
};

export default UserReportForm;
