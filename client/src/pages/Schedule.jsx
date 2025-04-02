import React, { useState, useEffect } from "react";

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
    <div style={{ padding: "20px" }}>
      <h1>Waste Bin Schedule Predictions</h1>

      {/* Display all predictions */}
      <h2>All Predictions</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <table border="1" style={{ width: "100%", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Bin ID</th>
            <th>Predicted Approximate Time (hrs)</th>
            <th>Predicted Emptying DateTime</th>
          </tr>
        </thead>
        <tbody>
          {predictions.map((item) => (
            <tr key={item._id}>
              <td>{item._id}</td>
              <td>{item.predictedApproxTime}</td>
              <td>{item.predictedEmptyingDateTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Form to fetch a single prediction */}
      <h2>Get Prediction for a Specific Bin</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Query Index:
          <input
            type="number"
            value={queryIndex}
            onChange={(e) => setQueryIndex(e.target.value)}
            required
          />
        </label>
        <button type="submit">Get Prediction</button>
      </form>

      {/* Display single prediction */}
      {singlePrediction && (
        <div style={{ marginTop: "20px" }}>
          <h3>Single Prediction</h3>
          <p><strong>Bin ID:</strong> {singlePrediction["Bin ID"]}</p>
          <p><strong>Predicted Approximate Time:</strong> {singlePrediction["Predicted Approximate Time"]}</p>
          <p><strong>Predicted Emptying DateTime:</strong> {singlePrediction["Predicted Emptying DateTime"]}</p>
        </div>
      )}
    </div>
  );
};

export default Schedule;