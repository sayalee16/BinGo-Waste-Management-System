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
        fetch(`${import.meta.env.PORT}/api/userreport/reports`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
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
<<<<<<< HEAD
        const token = localStorage.getItem("token"); // Get the token from local storage

        if (!token) {
            setError("Unauthorized: Please log in to perform this action.");
            return;
        }

        fetch(`${import.meta.env.PORT}/api/userreport/reports/${reportId}`, {
=======
        fetch(`http://localhost:8800/api/userreport/reports`, {
>>>>>>> 4797297a2f2c45a0e70c2f9b78d20c53f9af03c4
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
                        report._id === reportId ? updatedReport : report
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
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - Approve Reports</h2>

            {/* Display error message if any */}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {/* Display reports or a message if no reports are found */}
            {reports.length === 0 && !error ? (
                <p>No reports found.</p>
            ) : (
                reports.map((report) => (
                    <div key={report._id} className="border p-4 mb-2 rounded">
                        <p>
                            <strong>Status:</strong> {report.status}
                        </p>
                        <p>
                            <strong>Description:</strong> {report.description || "No description"}
                        </p>
                        {report.attachment && (
                            <img
                                src={report.attachment}
                                alt="Report Image"
                                className="w-32 h-32"
                            />
                        )}
                        <div className="mt-2">
                            <button
                                className="bg-green-500 text-white px-4 py-1 rounded mr-2"
                                onClick={() => updateReportStatus(report._id, "approved")}
                            >
                                Approve
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-1 rounded"
                                onClick={() => updateReportStatus(report._id, "rejected")}
                            >
                                Reject
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
        </>
    );
  
};

export default AdminMainNavigation;
