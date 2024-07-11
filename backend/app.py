from flask import Flask, request, jsonify, send_file
from googleapiclient.discovery import build
import re
import os
import io
import pandas as pd
from dotenv import load_dotenv
import joblib
from preprocessing import preprocess_text, filter_and_translate
from flask_cors import CORS
from wordcloud import WordCloud, STOPWORDS
import matplotlib_inline as plt

app = Flask(__name__)
CORS(app)


model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = joblib.load(model_path)

# Replace with your YouTube Data API key
load_dotenv() 
API_KEY = os.getenv('YT_API_KEY')

if not API_KEY:
    raise ValueError("API Key not found. Please set YT_API_KEY in your .env file.")


youtube = build('youtube', 'v3', developerKey=API_KEY)

def extract_video_id(url):
    match = re.search(r'v=([^&]+)', url)
    return match.group(1) if match else None

def fetch_comments(video_url, api_key):
    youtube = build('youtube', 'v3', developerKey=api_key)
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError('Invalid YouTube URL')
    comments = []
    request = youtube.commentThreads().list(
        part="snippet",
        videoId=video_id,
        maxResults=100
    )
    response = request.execute()
    for item in response['items']:
        comment = item['snippet']['topLevelComment']['snippet']['textOriginal']
        comments.append(comment)
    df = pd.DataFrame({
        'Comment': comments,
    })
    return df

def analyze_comments(dataframe):
    comments = dataframe['Comment'].apply(preprocess_text)
    comments = dataframe['Comment'].apply(filter_and_translate)
    dataframe['Sentiment'] = model.predict(comments)
    return dataframe

@app.route('/', methods=['GET'])
def get_data():
    data = {
        "message":"API is Running"
    }
    return jsonify(data)

@app.route('/analyze', methods=['POST'])
def analyze():
    data = request.json
    video_url = data.get('video_url')
    
    try:
        df = fetch_comments(video_url, API_KEY)
        df = analyze_comments(df)
        return df.to_json(orient='records')
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': f"An error occurred: {e}"}), 500
    

@app.route('/wordcloud', methods = ['POST'])
def wc():
    data = request.json
    df = data.get('data')

    if df is None:
        return jsonify({'error': 'No data provided'}), 400
    
    df = pd.DataFrame(df) 
    stopwords = set(STOPWORDS)
    print(1)
    try:
        comment_text = " ".join(comment for comment in df['Comment'])
        wordcloud = WordCloud(width=400, height=400, background_color='white', max_words=100, stopwords=stopwords).generate(comment_text)
        img = io.BytesIO()
        wordcloud.to_image().save(img, format='PNG')
        img.seek(0)
        return send_file(img, mimetype='img/png')
    except Exception as e:
        return jsonify({'error': f"An error occurred: {e}"}), 500

@app.route('/visualization', methods=['POST'])
def visual():
    pass

if __name__ == '__main__':
    app.run(debug=True)
