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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted", formData);
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
