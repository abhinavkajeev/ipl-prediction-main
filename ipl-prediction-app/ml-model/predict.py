"""
IPL Match Winner Prediction - Prediction CLI Script
Reads JSON from stdin, outputs prediction as JSON to stdout.

Usage:
  echo '{"team1":"CSK","team2":"MI","venue":"Wankhede Stadium","toss_winner":"CSK","toss_decision":"BAT FIRST"}' | python predict.py
"""

import sys
import json
import os
import numpy as np
import joblib

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, "model.pkl")
ENCODER_PATH = os.path.join(SCRIPT_DIR, "encoder.pkl")
METADATA_PATH = os.path.join(SCRIPT_DIR, "metadata.json")


def load_model():
    """Load the trained model and encoders."""
    model = joblib.load(MODEL_PATH)
    encoders = joblib.load(ENCODER_PATH)
    with open(METADATA_PATH, "r") as f:
        metadata = json.load(f)
    return model, encoders, metadata


def safe_encode(encoder, value):
    """Safely encode a value, returning -1 if unseen."""
    try:
        return encoder.transform([value])[0]
    except ValueError:
        # Unseen label - find closest match
        classes = encoder.classes_
        for cls in classes:
            if value.lower() in cls.lower() or cls.lower() in value.lower():
                return encoder.transform([cls])[0]
        return 0  # fallback to first class


def predict(input_data):
    """Make a prediction."""
    model, encoders, metadata = load_model()

    team1 = input_data.get("team1", "")
    team2 = input_data.get("team2", "")
    venue = input_data.get("venue", "").split(",")[0].strip()
    toss_winner = input_data.get("toss_winner", team1)
    toss_decision = input_data.get("toss_decision", "BAT FIRST")

    # Encode
    features = np.array([[
        safe_encode(encoders["team1"], team1),
        safe_encode(encoders["team2"], team2),
        safe_encode(encoders["venue"], venue),
        safe_encode(encoders["toss_winner"], toss_winner),
        safe_encode(encoders["toss_decision"], toss_decision),
        1 if toss_winner == team1 else 0,  # team1_won_toss
        1 if "BAT" in toss_decision.upper() else 0,  # chose_bat
    ]])

    # Predict
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    winner = team1 if prediction == 1 else team2
    win_prob = float(max(probabilities))

    # Feature importance for context
    importance = metadata.get("feature_importance", {})
    factors = []
    if toss_winner == winner:
        factors.append(f"Toss advantage: {toss_winner} won the toss")
    if "BAT" in toss_decision.upper():
        factors.append("Batting first can set a target pressure")
    else:
        factors.append("Bowling first can exploit conditions")
    factors.append(f"Venue factor: {venue}")
    factors.append(f"Model accuracy: {metadata.get('accuracy', 0):.0%}")

    result = {
        "winner": winner,
        "loser": team2 if winner == team1 else team1,
        "probability": round(win_prob * 100, 1),
        "team1_win_prob": round(float(probabilities[1]) * 100, 1),
        "team2_win_prob": round(float(probabilities[0]) * 100, 1),
        "factors": factors,
        "team1": team1,
        "team2": team2,
    }

    return result


if __name__ == "__main__":
    try:
        input_text = sys.stdin.read()
        input_data = json.loads(input_text)
        result = predict(input_data)
        print(json.dumps(result))
    except Exception as e:
        error_result = {"error": str(e)}
        print(json.dumps(error_result))
        sys.exit(1)
