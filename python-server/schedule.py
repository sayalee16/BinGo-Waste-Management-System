# Import necessary libraries
import pandas as pd
from pymongo import MongoClient
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error
from datetime import datetime, timedelta

client = MongoClient("mongodb://localhost:27017/waste-management")  
db = client["waste-management"] 
collection = db["wasteBinData"]  

data_cursor = collection.find() 
data = pd.DataFrame(list(data_cursor))  # Convert to a Pandas DataFrame

# Convert 'approxTime' to numeric (in hours)
data['approxTime'] = data['approxTime'].str.replace(' hrs', '').astype(float)

# Convert 'wasteQuantityPerDay' to numeric (in tonnes)
data['wasteQuantityPerDay'] = data['wasteQuantityPerDay'].str.replace(' tonnes', '').astype(float)

features = ['realTimeCapacity', 'totalCapacity', 'wasteQuantityPerDay']
X = data[features]
y = data['approxTime']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

data['predictedApproxTime'] = model.predict(X)

mse = mean_squared_error(y, data['predictedApproxTime'])
print(f"Mean Squared Error: {mse}")

# Predict the exact date and time for emptying each bin
current_time = datetime.now()
data['predictedEmptyingDateTime'] = data['predictedApproxTime'].apply(
    lambda hours: (current_time + timedelta(hours=hours)).strftime('%Y-%m-%d %H:%M:%S')
)

# Display predictions for all bins
for index, row in data.iterrows():
    print(f"Bin ID: {row['_id']}, Predicted Approximate Time: {row['predictedApproxTime']:.2f} hrs, "
          f"Predicted Emptying DateTime: {row['predictedEmptyingDateTime']}")