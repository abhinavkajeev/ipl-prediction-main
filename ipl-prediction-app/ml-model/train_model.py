"""
IPL Match Winner Prediction - Model Training Script
Trains a Random Forest Classifier on historical IPL match data.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
import json

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(SCRIPT_DIR, "dataset", "matches.csv")
MODEL_PATH = os.path.join(SCRIPT_DIR, "model.pkl")
ENCODER_PATH = os.path.join(SCRIPT_DIR, "encoder.pkl")
METADATA_PATH = os.path.join(SCRIPT_DIR, "metadata.json")


def load_and_clean_data():
    """Load CSV and clean data for training."""
    df = pd.read_csv(DATASET_PATH, encoding="utf-8")

    # Filter rows: need valid winner, teams, venue, toss info
    required_cols = ["home_team", "away_team", "venue_name", "toss_won", "decision", "winner"]
    df = df.dropna(subset=required_cols)

    # Filter out "No result", "TBA" type entries
    df = df[~df["winner"].isin(["TBA", "TBC", ""])]
    df = df[~df["result"].str.contains("No result", case=False, na=True)]
    df = df[df["winner"].str.strip() != ""]

    # Standardize team names
    team_name_map = {
        "KXIP": "Punjab Kings",
        "Kings XI Punjab": "Punjab Kings",
        "Delhi Daredevils": "Delhi Capitals",
        "Deccan Chargers": "Sunrisers Hyderabad",
        "Rising Pune Supergiants": "Rising Pune Supergiant",
        "Pune Warriors": "Rising Pune Supergiant",
    }

    for col in ["home_team", "away_team", "toss_won", "winner"]:
        df[col] = df[col].replace(team_name_map)

    print(f"Loaded {len(df)} valid matches.")
    return df


def extract_features(df):
    """Extract features for ML model."""
    features = pd.DataFrame()

    features["team1"] = df["home_team"]
    features["team2"] = df["away_team"]
    features["venue"] = df["venue_name"].apply(lambda x: x.split(",")[0].strip() if isinstance(x, str) else x)
    features["toss_winner"] = df["toss_won"]
    features["toss_decision"] = df["decision"]

    # Binary: did team1 win the toss?
    features["team1_won_toss"] = (df["toss_won"] == df["home_team"]).astype(int)

    # Binary: was the toss decision to bat?
    features["chose_bat"] = (df["decision"].str.upper().str.contains("BAT", na=False)).astype(int)

    # Target: did team1 (home_team) win?
    target = (df["winner"] == df["home_team"]).astype(int)

    return features, target


def train_model():
    """Train and save the model."""
    print("=" * 60)
    print("IPL Match Winner Prediction - Model Training")
    print("=" * 60)

    # Load data
    df = load_and_clean_data()

    # Extract features
    features, target = extract_features(df)

    # Encode categorical variables
    encoders = {}
    encoded_features = pd.DataFrame()

    for col in ["team1", "team2", "venue", "toss_winner", "toss_decision"]:
        le = LabelEncoder()
        encoded_features[col] = le.fit_transform(features[col].astype(str))
        encoders[col] = le

    # Add numeric features
    encoded_features["team1_won_toss"] = features["team1_won_toss"]
    encoded_features["chose_bat"] = features["chose_bat"]

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        encoded_features, target, test_size=0.2, random_state=42, stratify=target
    )

    print(f"\nTraining set: {len(X_train)} samples")
    print(f"Test set: {len(X_test)} samples")

    # Train Random Forest
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        class_weight="balanced",
        random_state=42,
        n_jobs=-1,
    )

    model.fit(X_train, y_train)

    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    print(f"\n--- Model Performance ---")
    print(f"Accuracy: {accuracy:.2%}")
    print(f"\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=["Away Team Win", "Home Team Win"]))

    # Feature importance
    importance = dict(zip(encoded_features.columns, model.feature_importances_))
    print("\nFeature Importance:")
    for feat, imp in sorted(importance.items(), key=lambda x: -x[1]):
        print(f"  {feat}: {imp:.4f}")

    # Save model and encoders
    joblib.dump(model, MODEL_PATH)
    joblib.dump(encoders, ENCODER_PATH)

    # Save metadata
    teams = sorted(encoders["team1"].classes_.tolist())
    venues = sorted(encoders["venue"].classes_.tolist())
    toss_decisions = sorted(encoders["toss_decision"].classes_.tolist())

    metadata = {
        "accuracy": round(accuracy, 4),
        "teams": teams,
        "venues": venues,
        "toss_decisions": toss_decisions,
        "total_matches": len(df),
        "features": list(encoded_features.columns),
        "feature_importance": {k: round(v, 4) for k, v in importance.items()},
    }

    with open(METADATA_PATH, "w") as f:
        json.dump(metadata, f, indent=2)

    print(f"\n✅ Model saved to {MODEL_PATH}")
    print(f"✅ Encoders saved to {ENCODER_PATH}")
    print(f"✅ Metadata saved to {METADATA_PATH}")
    print("=" * 60)


if __name__ == "__main__":
    train_model()
