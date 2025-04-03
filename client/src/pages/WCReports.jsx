import WCNavbar from "../components/WasteCollectorNavbar";
import { useEffect, useState } from "react";

const WCReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const GetReports = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userreport/reports`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                const data = await res.json();
                setReports(data); // Set the reports data to state
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };
        GetReports();
    }, []);

    return (
        <div>
            <WCNavbar />
            <div className="mx-auto px-9 py-6">
                <h1 className="text-2xl font-bold text-center mb-6 text-green-700">Waste Collector Reports</h1>
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
        </div>
    );
};

export default WCReports;