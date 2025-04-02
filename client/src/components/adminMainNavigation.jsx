import { useState, useEffect } from "react";

const AdminMainNavigation = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/api/userreport/reports")  // Fetch reports from your backend
            .then(res => res.json())
            .then(data => setReports(data))
            .catch(err => console.error(err));
    }, []);

    const updateReportStatus = (reportId, status) => {
        fetch(`http://localhost:5000/api/userreport/reports/${reportId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ admin_status: status })
        })
        .then(res => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        })
        .then(() => {
            setReports(reports.map(report => 
                report._id === reportId ? { ...report, admin_status: status } : report
            ));
        })
        .catch(err => console.error("Error updating report:", err));
        
    };

    return (
        <div className="p-6 border rounded-lg shadow-lg bg-white m-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Panel - Approve Reports</h2>
            {reports.length === 0 ? <p>No reports found.</p> : (

                reports.map(report => (
                    
                    <div key={report._id} className="border p-4 mb-2 rounded">

                        <p><strong>Status:</strong> {report.status}</p>
                        <p><strong>Description:</strong> {report.description || "No description"}</p>
                        <p><strong>Bin ID:</strong> {report.bin}</p>
                        
                        {report.attachment && (
                            <img src={report.attachment} alt="Report Image" className="w-32 h-32" />
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
    );
};

export default AdminMainNavigation;
