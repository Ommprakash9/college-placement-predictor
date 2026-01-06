import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
import json
import os

# 1. Generate Synthetic Data
np.random.seed(42)
n_samples = 1000

data = {
    'cgpa': np.random.uniform(6.0, 10.0, n_samples),
    'internships': np.random.randint(0, 4, n_samples),
    'projects': np.random.randint(0, 6, n_samples),
    'skill_level': np.random.randint(1, 11, n_samples),
    'communication_score': np.random.randint(1, 11, n_samples),
}

df = pd.DataFrame(data)

# Logic for placement:
# Higher CGPA, more internships, projects, and skills -> higher chance
# Score = w1*cgpa + w2*intern + w3*proj + w4*skill + w5*comm + noise
score = (
    (df['cgpa'] - 6) * 15 +       # 0-4 range * 15 = 0-60
    df['internships'] * 10 +      # 0-3 range * 10 = 0-30
    df['projects'] * 5 +          # 0-5 range * 5 = 0-25
    df['skill_level'] * 2 +       # 1-10 range * 2 = 2-20
    df['communication_score'] * 2 # 1-10 range * 2 = 2-20
)
# Max approx: 60+30+25+20+20 = 155. Min approx: 4.
# Let's say score > 80 is placed.
# Add some noise to make it realistic (not perfectly separable)
noise = np.random.normal(0, 15, n_samples)
final_score = score + noise

df['placed'] = (final_score > 75).astype(int)

# 2. Train Model
X = df[['cgpa', 'internships', 'projects', 'skill_level', 'communication_score']]
y = df['placed']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = LogisticRegression()
model.fit(X_train, y_train)

accuracy = model.score(X_test, y_test)
print(f"Model trained. Accuracy: {accuracy:.2f}")

# 3. Save Model to JSON
model_dir = 'model'
if not os.path.exists(model_dir):
    os.makedirs(model_dir)

model_data = {
    "intercept": model.intercept_.tolist(),
    "coefficients": model.coef_.tolist(),
    "classes": model.classes_.tolist(),
    "accuracy": accuracy
}

with open(os.path.join(model_dir, 'model.json'), 'w') as f:
    json.dump(model_data, f)

print(f"Model saved to {os.path.join(model_dir, 'model.json')}")

# Save CSV for reference (as requested)
dataset_dir = 'dataset'
if not os.path.exists(dataset_dir):
    os.makedirs(dataset_dir)
df.to_csv(os.path.join(dataset_dir, 'placement.csv'), index=False)
print("Dataset saved to dataset/placement.csv")
