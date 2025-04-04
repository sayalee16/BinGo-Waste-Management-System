import { useState } from "react";
import Navbar from "../components/Navbar";

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
    e.preventDefault();
    console.log("Form Submitted", formData);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/userreport/create-report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          },
          body: JSON.stringify({
            bin: formData.bin,
            user_id: formData.user_id,
            status: formData.status,
            description: formData.description,
            attachment: formData.attachment,
          }),
        }
      );

      const data = await res.json(); // Convert response to JSON
      console.log("Server Response:", data); // Debugging

      // Store token and user data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Clear state and show success message
      setOldUser({ phone: "", password: "" });
      setError("");
      setLoggedIn(true);
      alert("Login successful!");

      if (data.user.isAdmin) {
        navigate("/adminMainNavigation"); // Redirect to admin Main page
      } else {
        navigate("/userMainNavigation"); // Redirect to user Main page
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Please try again.");
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

          <label className="block text-green-700 font-medium mb-1 text-sm">
            User ID:
          </label>
          <input
            type="text"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            required
            className="w-full p-1 border rounded-md focus:ring-2 focus:ring-green-400 mb-3 text-sm"
          />

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
          <div className="relative w-full mb-3">
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
              className="w-full p-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-md shadow-sm text-center cursor-pointer transition duration-300 text-sm"
            >
              Choose File
            </label>
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
