import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import AdminNavbar from "../components/adminNav";

const Schedule = () => {
  const [predictions, setPredictions] = useState([]);
  const [queryIndex, setQueryIndex] = useState("");
  const [singlePrediction, setSinglePrediction] = useState(null);
  const [error, setError] = useState("");

  // Fetch all predictions on component mount
  useEffect(() => {
    fetch("http://127.0.0.1:5000/schedule")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch predictions.");
        }
        return response.json();
      })
      .then((data) => {
        setPredictions(data.rec || []);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  }, []);

  // Handle form submission for single prediction
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:5000/schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ query_index: queryIndex }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch prediction for the given index.");
        }
        return response.json();
      })
      .then((data) => {
        setSinglePrediction(data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  return (
    <>
    <AdminNavbar/>
    <div className="p-6 mt-3 max-w-4xl mx-auto bg-white shadow-lg rounded-2xl">
      
      <h1 className="text-2xl font-bold text-center mb-6">Waste Bin Schedule Predictions</h1>
      
      {error && <p className="text-red-500 text-center">{error}</p>}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Bin ID</th>
              <th className="border border-gray-300 px-4 py-2">Ward</th>
              <th className="border border-gray-300 px-4 py-2">Last Emptied</th>
              <th className="border border-gray-300 px-4 py-2">Predicted Approx. Time (hrs)</th>
              <th className="border border-gray-300 px-4 py-2">Predicted Emptying DateTime</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((item) => (
              <tr key={item._id} className="even:bg-gray-100">
                <td className="border border-gray-300 px-4 py-2">{item._id}</td>
                <td className="border border-gray-300 px-4 py-2">{item.ward}</td>
                <td className="border border-gray-300 px-4 py-2">{item.lastEmptiedAt}</td>
                <td className="border border-gray-300 px-4 py-2">{item.predictedApproxTime.toFixed(2)}</td>
                <td className="border border-gray-300 px-4 py-2">{item.predictedEmptyingDateTime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* <h2 className="text-xl font-semibold mt-6 mb-4">Get Prediction for a Specific Bin</h2>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <label className="font-medium">Query Index:</label>
        <input
          type="number"
          value={queryIndex}
          onChange={(e) => setQueryIndex(e.target.value)}
          required
          className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Get Prediction</button>
      </form> */}
      
      {/* {singlePrediction && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
          <h3 className="text-lg font-semibold">Single Prediction</h3>
          <p><strong>Bin ID:</strong> {singlePrediction["Bin ID"]}</p>
          <p><strong>Predicted Approximate Time:</strong> {singlePrediction["Predicted Approximate Time"]}</p>
          <p><strong>Predicted Emptying DateTime:</strong> {singlePrediction["Predicted Emptying DateTime"]}</p>
        </div>
      )} */}
    </div>
    </>
  );
};

export default Schedule;