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

        # Preprocess data
        data['wasteQuantityPerDay'] = data['wasteQuantityPerDay'].str.replace(' tonnes', '').astype(float)
        data['lastEmptiedAt'] = pd.to_datetime(data['lastEmptiedAt'])  # Convert to datetime

        # Calculate predictedApproxTime dynamically
        # Formula: (totalCapacity - realTimeCapacity) / (wasteQuantityPerDay / 24)
        data['predictedApproxTime'] = (data['totalCapacity'] - data['realTimeCapacity']) / (data['wasteQuantityPerDay'] / 24)

        # Calculate the predicted emptying datetime based on lastEmptiedAt
        data['predictedEmptyingDateTime'] = data.apply(
            lambda row: (row['lastEmptiedAt'] + timedelta(hours=row['predictedApproxTime'])).strftime('%Y-%m-%d %H:%M:%S'),
            axis=1
        )

        # Convert ObjectId to string for JSON serialization
        data['_id'] = data['_id'].astype(str)

        # Handle GET and POST requests
        if request.method == 'POST':
            query_index = int(request.json.get("query_index", 0))
            if query_index < 0 or query_index >= len(data):
                return jsonify({"error": "Invalid query index"}), 400

            # Return prediction for a specific bin
            bin_data = data.iloc[query_index]
            return jsonify({
                "Bin ID": bin_data['_id'],  # Already converted to string
                "Predicted Approximate Time": f"{bin_data['predictedApproxTime']:.2f} hrs",
                "Predicted Emptying DateTime": bin_data['predictedEmptyingDateTime']
            })

        # For GET requests, return all predictions
        rec = data[['_id', 'predictedApproxTime', 'predictedEmptyingDateTime', 'ward', 'lastEmptiedAt']].to_dict(orient='records')
        return jsonify({"rec": rec}), 200

    except Exception as e:
        # Log the error and return a 500 response
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)