import React from 'react';
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const Complaints = () => {
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
        return (
            <>
            <Navbar/>
            <div className="mx-auto px-9 py-6">
                <h2 className="text-2xl font-bold text-center mb-6 text-green-700">Admin Panel - Approve Reports</h2>
    
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
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </>
        );
};

export default Complaints;