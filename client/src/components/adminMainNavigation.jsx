import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

const AdminMainNavigation = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const {currUser, updateUser} = useContext(AuthContext);

  console.log("Current User:", currUser);

  useEffect(() => {
    if (!token) {
      setError("Unauthorized: Please log in to perform this action.");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/reports`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch reports");
        }
        return res.json();
      })
      .then((data) => setReports(data))
      .catch((err) => {
        console.error("Error fetching reports:", err);
        setError("Failed to load reports. Please try again later.");
      });
  }, [token]);

  const updateReportStatus = (reportId, status) => {
    if (!token) {
      setError("Unauthorized: Please log in to perform this action.");
      return;
    }

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/admin-update-report/${reportId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ admin_status: status }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update report status");
        }
        return res.json();
      })
      .then((updatedReport) => {
        setReports((prevReports) =>
          prevReports.map((report) =>
            report._id === reportId ? { ...report, ...updatedReport } : report
          )
        );
        setError("");
      })
      .catch((err) => {
        console.error("Error updating report:", err);
        setError("Failed to update the report. Please try again.");
      });
  };

  const clearCompletedReports = () => {
    if (!window.confirm("Are you sure you want to delete all completed reports?")) return;

    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/delete-reports`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete reports");
        }
        return res.json();
      })
      .then((data) => {
        alert(data.msg);
        setReports((prevReports) => prevReports.filter((report) => report.wc_status !== "done"));
      })
      .catch((err) => {
        console.error("Error deleting reports:", err);
        setError("Failed to delete completed reports.");
      });
  };

  return (
    <>
      <Navbar />
      <div className="p-6 border rounded-lg shadow-lg bg-white mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">BIN REPORTS</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <button
          className="bg-red-500 text-white font-bold px-4 py-2 rounded"
          onClick={clearCompletedReports}
        >
          Clear Completed Reports
        </button>
        <div className="flex flex-wrap flex-col gap-6 justify-center mt-4">
          {reports.length > 0 ? (
            reports.map((report) => (
              <div key={report._id} className="flex w-full md:w-2/3 lg:w-1/2 bg-green-200 shadow-lg rounded-xl overflow-hidden">
                <img
  src={
    report.attachment?.data?.data
      ? `data:image/jpeg;base64,${btoa(
          report.attachment.data.data.map((byte) => String.fromCharCode(byte)).join("")
        )}`
      : "/placeholder.jpg" // fallback if no image
  }
  alt="Report Attachment"
  className="w-1/3 h-auto object-cover"
/>

                <div className="p-4 w-2/3">
                  <h2 className={`text-lg font-semibold mb-2 ${report.bin ? "text-green-800" : "text-red-800"}`}>
                    {report.bin ? `Status: ${report.status}` : "Complaint"}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    <strong>Description:</strong>{" "}
                    {report.description || "No description provided."}
                  </p>
                  {report.bin && (
                    <>
                      <p className="text-gray-700 mb-2">
                        <strong>Bin Name:</strong> {report.bin._id || "No Name Provided"}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Bin Ward:</strong> {report.bin.ward || "No Ward Provided"}
                      </p>
                    </>
                  )}
                  <p className="text-gray-700">
                    <strong>Reported By:</strong>{" "}
                    {report.user_id?.name || report.user_id?._id || "Unknown User"}
                  </p>
            
                 {/* Timeline UI */}
<div className="mt-4  overflow-visible">
  <p className="font-semibold mb-2 text-gray-800">Waste Collector Status:</p>
  <div className="relative flex items-center justify-between w-full px-2">
    {["pending", "done", "recycled"].map((status, index) => {
      const currentIndex = ["pending", "done", "recycled"].indexOf(report.wc_status);
      const isActive = index <= currentIndex;

      return (
        <div key={status} className="flex-1 flex flex-col items-center relative">
          {/* Connecting Line */}
          {index < 2 && (
            <div className="absolute top-2 left-1/2 w-full h-1 -z-10">
              <div
                className={`h-1 ${
                  currentIndex > index ? "bg-green-600" : "bg-gray-300"
                }`}
              ></div>
            </div>
          )}

          {/* Status Dot */}
          <div
            className={`w-5 h-5 rounded-full z-10 ${
              isActive ? "bg-green-600" : "bg-gray-400"
            }`}
          ></div>

          {/* Status Label */}
          <span className="text-xs mt-2 text-gray-700 capitalize">{status}</span>
        </div>
      );
    })}
  </div>
</div>

                  {/* Action Buttons */}
                  <div className="mt-4">
                    <button
                      className="bg-green-500 font-bold text-white px-4 py-2 rounded mr-2"
                      onClick={() => updateReportStatus(report._id, "approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 font-bold text-white px-4 py-2 rounded"
                      onClick={() => updateReportStatus(report._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center">No reports available.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminMainNavigation;
