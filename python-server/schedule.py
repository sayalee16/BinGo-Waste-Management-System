# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from datetime import datetime, timedelta

# Load the JSON data
data = pd.read_json("../data/waste_bin_data.json")

# Convert 'approxTime' to numeric (in hours)
data['approxTime'] = data['approxTime'].str.replace(' hrs', '').astype(float)

# Convert 'wasteQuantityPerDay' to numeric (in tonnes)
data['wasteQuantityPerDay'] = data['wasteQuantityPerDay'].str.replace(' tonnes', '').astype(float)

# Select relevant features and target variable
features = ['realTimeCapacity', 'totalCapacity', 'wasteQuantityPerDay']
X = data[features]
y = data['approxTime']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train a Random Forest Regressor
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Make predictions for the entire dataset
data['predictedApproxTime'] = model.predict(X)

# Evaluate the model
mse = mean_squared_error(y, data['predictedApproxTime'])
print(f"Mean Squared Error: {mse}")

# Predict the exact date and time for emptying each bin
current_time = datetime.now()
data['predictedEmptyingDateTime'] = data['predictedApproxTime'].apply(
    lambda hours: (current_time + timedelta(hours=hours)).strftime('%Y-%m-%d %H:%M:%S')
)

# Display predictions for all bins
for index, row in data.iterrows():
    print(f"Bin ID: {row['id']}, Predicted Approximate Time: {row['predictedApproxTime']:.2f} hrs, "
          f"Predicted Emptying DateTime: {row['predictedEmptyingDateTime']}")