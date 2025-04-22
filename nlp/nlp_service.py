import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()
api_key = os.getenv("Gemini_key")

# Validate API key
if not api_key:
    raise ValueError("Gemini API key not found. Please set 'Gemini_key' in your .env file.")

# Configure Gemini
genai.configure(api_key=api_key)
model = genai.GenerativeModel("gemini-1.5-flash")  # Recommended for fast customer support

# Initialize Flask app
app = Flask(__name__)
CORS(app)

@app.route('/nlp', methods=['POST'])
def nlp_response():
    data = request.get_json()
    user_message = data.get('message', '').strip()

    if not user_message:
        return jsonify({'reply': 'Please enter a valid message so I can assist you.'})

    # Construct a customer service-oriented prompt
    prompt = f"""
You are HelpBot, a professional and friendly customer service assistant.
Always respond politely and helpfully in a way that resolves the user's issue.

Customer message:
\"\"\"{user_message}\"\"\"

Reply with a helpful, concise answer:
"""

    try:
        response = model.generate_content(prompt)
        reply = response.text.strip()
    except Exception as e:
        print("Gemini API error:", e)
        reply = "Sorry, I'm having trouble processing your request. Please try again shortly."

    return jsonify({'reply': reply})

if __name__ == '__main__':
    app.run(port=5000)
