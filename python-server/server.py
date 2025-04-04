from flask import Flask, jsonify, request, render_template
from pymongo import MongoClient
from flask_cors import CORS  # Import CORS

import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app) 

client = MongoClient("mongodb://localhost:27017/waste-management")  
db = client["waste-management"] 
collection = db["wastebins"]  


@app.route('/schedule', methods=['POST', 'GET'])
def schedule():
    try:
        # Fetch data from MongoDB
        data_cursor = collection.find()
        data = pd.DataFrame(list(data_cursor))

        # If no data is returned
        if data.empty:
            return jsonify({"error": "No data found in the database"}), 404

        # Preprocess data
        data['wasteQuantityPerDay'] = data['wasteQuantityPerDay'].str.replace(' tonnes', '').astype(float)
        data['lastEmptiedAt'] = pd.to_datetime(data['lastEmptiedAt'])

        # Calculate predictedApproxTime dynamically
        data['predictedApproxTime'] = (data['totalCapacity'] - data['realTimeCapacity']) / (data['wasteQuantityPerDay'] / 24)

        # Calculate predicted emptying datetime
        data['predictedEmptyingDateTime'] = data.apply(
            lambda row: (row['lastEmptiedAt'] + timedelta(hours=row['predictedApproxTime'])).strftime('%Y-%m-%d %H:%M:%S'),
            axis=1
        )

        # Determine the status based on realTimeCapacity and totalCapacity
        def determine_status(row):
            capacity_ratio = row['realTimeCapacity'] / row['totalCapacity']
            if capacity_ratio >= 0.8:
                return "filled"
            elif 0.3 <= capacity_ratio < 0.8:
                return "partially_filled"
            else:
                return "empty"

        data['status'] = data.apply(determine_status, axis=1)

        # Store original ObjectIds
        original_ids = data['_id'].copy()

        # Save predictions and status back to the database using original ObjectIds
        for i, row in data.iterrows():
            collection.update_one(
                {"_id": original_ids[i]},
                {"$set": {
                    "predictedApproxTime": row['predictedApproxTime'],
                    "predictedEmptyingDateTime": row['predictedEmptyingDateTime'],
                    "status": row['status']
                }}
            )

        # Convert _id to string for response
        data['_id'] = data['_id'].astype(str)

        if request.method == 'POST':
            query_index = int(request.json.get("query_index", 0))
            if query_index < 0 or query_index >= len(data):
                return jsonify({"error": "Invalid query index"}), 400

            bin_data = data.iloc[query_index]
            return jsonify({
                "Bin ID": bin_data['_id'],
                "Predicted Approximate Time": f"{bin_data['predictedApproxTime']:.2f} hrs",
                "Predicted Emptying DateTime": bin_data['predictedEmptyingDateTime'],
                "Status": bin_data['status']
            })

        # For GET requests, return all predictions
        rec = data[['_id', 'predictedApproxTime', 'predictedEmptyingDateTime', 'status', 'ward', 'lastEmptiedAt']].to_dict(orient='records')

        print(rec)  # For debugging

        return jsonify({"rec": rec}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)