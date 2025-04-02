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
collection = db["wasteBinData"]  


@app.route('/schedule', methods=['POST', 'GET'])
def schedule():
    try:
        # Fetch data from MongoDB
        data_cursor = collection.find()
        data = pd.DataFrame(list(data_cursor))

        # Preprocess data
        data['approxTime'] = data['approxTime'].str.replace(' hrs', '').astype(float)
        data['wasteQuantityPerDay'] = data['wasteQuantityPerDay'].str.replace(' tonnes', '').astype(float)

        # Select relevant features and target variable
        features = ['realTimeCapacity', 'totalCapacity', 'wasteQuantityPerDay']
        X = data[features]
        y = data['approxTime']

        # Train a Random Forest Regressor
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        model = RandomForestRegressor(n_estimators=100, random_state=42)
        model.fit(X_train, y_train)

        # Make predictions for the entire dataset
        data['predictedApproxTime'] = model.predict(X)
        current_time = datetime.now()
        data['predictedEmptyingDateTime'] = data['predictedApproxTime'].apply(
            lambda hours: (current_time + timedelta(hours=hours)).strftime('%Y-%m-%d %H:%M:%S')
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
        rec = data[['_id', 'predictedApproxTime', 'predictedEmptyingDateTime']].to_dict(orient='records')
        return jsonify({"rec": rec}), 200

    except Exception as e:
        # Log the error and return a 500 response
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)