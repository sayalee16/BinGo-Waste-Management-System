import { useState, useEffect } from "react";
import AdminNavbar from "./adminNav";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
import { FaTruck, FaCheckCircle, FaRecycle } from "react-icons/fa";

const AdminMainNavigation = () => {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [disabledButtons, setDisabledButtons] = useState({});
  const { currUser, updateUser } = useContext(AuthContext);

  console.log("Current User:", currUser);

  const statuses = ["pending", "done", "recycled"];

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

    setDisabledButtons((prev) => ({
      ...prev,
      [reportId]: status,
    }));
    fetch(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/userreport/admin-update-report/${reportId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ admin_status: status }),
      }
    )
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
        alert(status === "approved" ? "Report approved!" : "Report rejected!");
        setError("");
      })
      .catch((err) => {
        console.error("Error updating report:", err);
        setError("Failed to update the report. Please try again.");
      });
  };

  const clearCompletedReports = () => {
    if (
      !window.confirm("Are you sure you want to delete all completed reports?")
    )
      return;

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
        setReports((prevReports) =>
          prevReports.filter((report) => report.wc_status !== "recycled")
        );
      })
      .catch((err) => {
        console.error("Error deleting reports:", err);
        setError("Failed to delete completed reports.");
      });
  };

  return (
    <>
      <AdminNavbar />
      {/* Admin Dashboard Banner */}
      <div className="bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white py-1 shadow-lg text-center rounded-b-2xl">
  <p className="text-base mt-2 text-green-100 italic">
    Command center for cleaner cities and smarter waste solutions
  </p>
</div>

      <div className="p-4 border-gray-600 rounded-xl shadow-2xl bg-white mt-2 mx-auto max-w-6xl">
        <h2 className="text-4xl font-bold mb-4 text-center">BIN REPORTS</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}

        <div className="flex flex-wrap flex-col gap-6 items-center max-w-6xl justify-center">
          <button
            className="bg-red-500 text-white font-bold px-4 py-2 rounded"
            onClick={clearCompletedReports}
          >
            Clear Completed Reports
          </button>
          {reports.length > 0 ? (
            reports.map((report) => (
              <div
                key={report._id}
                className="flex w-full md:w-3/4 lg:w-4/5 bg-green-100 shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={
                    report.attachment?.data?.data
                      ? `data:image/jpeg;base64,${btoa(
                          report.attachment.data.data
                            .map((byte) => String.fromCharCode(byte))
                            .join("")
                        )}`
                      : "/placeholder.jpg"
                  }
                  alt="Report Attachment"
                  className="w-1/3 h-auto object-cover"
                />

                <div className="p-4 w-2/3">
                  <h2
                    className={`text-lg font-semibold mb-2 ${
                      report.bin ? "text-green-800" : "text-red-800"
                    }`}
                  >
                    {report.bin ? `Status: ${report.status}` : "Complaint"}
                  </h2>
                  <p className="text-gray-700 mb-2">
                    <strong>Description:</strong>{" "}
                    {report.description || "No description provided."}
                  </p>
                  {report.bin && (
                    <>
                      <p className="text-gray-700 mb-2">
                        <strong>Bin Name:</strong>{" "}
                        {report.bin._id || "No Name Provided"}
                      </p>
                      <p className="text-gray-700 mb-2">
                        <strong>Bin Ward:</strong>{" "}
                        {report.bin.ward || "No Ward Provided"}
                      </p>
                    </>
                  )}
                  <p className="text-gray-700">
                    <strong>Reported By:</strong>{" "}
                    {report.user_id?.name ||
                      report.user_id?._id ||
                      "Unknown User"}
                  </p>

                  {/* Timeline UI */}
                  <div className="mt-6">
                    <p className="font-semibold mb-4 text-gray-800 text-center">
                      Waste Collector Status
                    </p>
                    <div className="relative flex items-center justify-between w-full px-4">
                      {statuses.map((status, index) => {
                        const currentIndex = statuses.indexOf(
                          report.wc_status
                        );
                        const isActive = index <= currentIndex;

                        const iconMap = {
                          pending: <FaTruck />,
                          done: <FaCheckCircle />,
                          recycled: <FaRecycle />,
                        };

                        return (
                          <div
                            key={status}
                            className="flex-1 flex flex-col items-center relative"
                          >
                            {/* Connecting Line */}
                            {index < 2 && (
                              <div
                                className={`absolute top-5 left-full transform -translate-x-1/2 w-full h-1 ${
                                  currentIndex > index
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                                }`}
                              ></div>
                            )}

                            {/* Status Icon */}
                            <div
                              className={`w-10 h-10 rounded-full z-10 flex items-center justify-center text-xl shadow-md ${
                                isActive
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-400 text-gray-200"
                              }`}
                            >
                              {iconMap[status]}
                            </div>

                            {/* Status Label */}
                            <span
                              className={`text-sm mt-2 ${
                                isActive
                                  ? "text-green-800 font-semibold"
                                  : "text-gray-500"
                              } capitalize`}
                            >
                              {status}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="mt-4">
                  <button
                      className={`font-bold px-4 py-2 rounded mr-2 ${
                        report.admin_status === "approved" ||
                        disabledButtons[report._id] === "approved"
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500 text-white hover:bg-green-600"
                      }`}
                      onClick={() =>
                        updateReportStatus(report._id, "approved")
                      }
                      disabled={
                        report.admin_status === "approved" ||
                        disabledButtons[report._id] === "approved"
                      }
                    >
                      Approve
                    </button>
                    <button
                      className={`font-bold px-4 py-2 rounded ${
                        report.admin_status === "rejected" ||
                        disabledButtons[report._id] === "rejected"
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                      onClick={() =>
                        updateReportStatus(report._id, "rejected")
                      }
                      disabled={
                        report.admin_status === "rejected" ||
                        disabledButtons[report._id] === "rejected"
                      }
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
