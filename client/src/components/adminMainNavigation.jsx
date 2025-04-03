import { useState, useEffect } from "react";
import Navbar from "./Navbar";

const AdminMainNavigation = () => {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(""); // State to handle errors
    const token = localStorage.getItem("token"); // Get the token from local storage

    if (!token) {
        setError("Unauthorized: Please log in to perform this action.");
        return;
    }
    // Fetch reports from the backend when the component mounts
    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/reports`, {
            method: "GET",
            headers: {
                 "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
            }
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
    }, []);

    // Function to update the status of a report
    const updateReportStatus = (reportId, status) => {
        const token = localStorage.getItem("token"); // Get the token from local storage
        console.log(status, reportId);
        
        if (!token) {
            setError("Unauthorized: Please log in to perform this action.");
            return;
        }

        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/admin-update-report/${reportId}`, {
        
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // Include the token in the Authorization header
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
                // Update the specific report in the state
                setReports((prevReports) =>
                    prevReports.map((report) =>
                    report._id === reportId
                        ? { ...report, ...updatedReport } // Merge updated fields with existing report
                        : report
                )
                );
                setError(""); // Clear any previous errors
            })
            .catch((err) => {
                console.error("Error updating report:", err);
                setError("Failed to update the report. Please try again.");
            });
    };

    return (
        <>
        <Navbar/>
        <div className="p-6 border rounded-lg shadow-lg bg-white mt-10">
            <h2 className="text-2xl font-bold mb-4 text-center">BIN REPORTS</h2>
            <button
    className="bg-red-500 text-white font-bold px-4 py-2 rounded"
    onClick={() => {
        if (window.confirm("Are you sure you want to delete all completed reports?")) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/delete-reports`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                }
            })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to delete reports");
                }
                return res.json();
            })
            .then((data) => {
                alert(data.msg); // Show success message
                setReports((prevReports) => prevReports.filter(report => report.wc_status !== "done"));
            })
            .catch((err) => {
                console.error("Error deleting reports:", err);
                setError("Failed to delete completed reports.");
            });
        }
    }}
>
    Clear Completed Reports
</button>

            {/* Display error message if any */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Display reports or a message if no reports are found */}
            <div className="flex flex-wrap gap-6 justify-center">
                {reports.map((report) => (
                        <div
                            key={report._id}
                            className="flex w-full md:w-2/3 lg:w-1/2 bg-green-200 shadow-lg rounded-xl overflow-hidden"
                        >
                            <img
                                src={report.attachment}
                                alt="Report Attachment"
                                className="w-1/3 h-auto object-cover"
                            />
                            <div className="p-4 w-2/3">
                                <h2 className="text-lg font-semibold text-green-800 mb-2">Status: {report.status}</h2>
                                <p className="text-gray-700 mb-2">
                                    <strong>Description:</strong> {report.description || "No description provided."}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Bin Name:</strong> {report.bin?._id || "No Name Provided"}
                                </p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Bin ward:</strong> {report.bin?.ward || "No Name Provided"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Reported By:</strong> {report.user_id?.name || report.user_id?._id || "Unknown User"}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Waste Collector Status:</strong> {report.wc_status}
                                </p>
                                <button className="bg-green-500 font-bold text-white px-4 py-2 rounded mr-2" onClick={() => updateReportStatus(report._id, "approved")}>Approve</button>
   
                                <button className="bg-red-500 font-bold text-white px-4 py-2 rounded" onClick={() => updateReportStatus(report._id, "rejected")}>Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
        </div>
        </>
    );
  
};

export default AdminMainNavigation;
