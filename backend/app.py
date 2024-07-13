import os
import re
import io
import emoji
import joblib
import string
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from flask import Flask, request, jsonify, send_file
from googleapiclient.discovery import build
from flask_cors import CORS
from wordcloud import WordCloud, STOPWORDS
from dotenv import load_dotenv
from langdetect import detect
from googletrans import Translator
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer

# Ensure nltk resources are downloaded
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)


model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = joblib.load(model_path)

# Replace with your YouTube Data API key
load_dotenv() 
API_KEY = os.getenv('YT_API_KEY')
if not API_KEY:
    raise ValueError("API Key not found. Please set YT_API_KEY in your .env file.")

plt.switch_backend('Agg')

youtube = build('youtube', 'v3', developerKey=API_KEY)

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()

def remove_punctuations(text):
    return text.translate(str.maketrans('', '', string.punctuation))

def preprocess_text(text):
    text = remove_punctuations(text)
    text = text.lower()
    text = emoji.demojize(text)
    tokens = word_tokenize(text)
    tokens = [item for item in tokens if item not in stop_words]
    tokens = [lemmatizer.lemmatize(item) for item in tokens]
    return ' '.join(tokens)

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

def filter_and_translate(dataframe):
    translator = Translator()
    filtered_comments = []

    for comment in dataframe['Comment']:
        try:
            lang = detect(comment)
            if lang == 'en':
                filtered_comments.append(comment)
            elif lang == 'hi':  # Assuming Hinglish comments will be detected as Hindi
                translated_comment = translator.translate(comment, src='hi', dest='en').text
                filtered_comments.append(translated_comment)
        except:
            continue

    return pd.DataFrame({'Comment': filtered_comments})

def analyze_comments(dataframe):
    try:
        comments = dataframe['Comment'].apply(preprocess_text)
    except Exception as e:
        print(f"Error during preprocessing: {e}")
        return dataframe

    try:
        dataframe['Sentiment'] = model.predict(comments)
    except Exception as e:
        print(f"Error during prediction: {e}")

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
        df = filter_and_translate(df)
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
    try:
        comment_text = " ".join(comment for comment in df['Comment'])
        wordcloud = WordCloud(width=400, height=400, background_color='white', max_words=100, stopwords=stopwords).generate(comment_text)
        img = io.BytesIO()
        wordcloud.to_image().save(img, format='PNG')
        img.seek(0)
        return send_file(img, mimetype='img/png')
    except Exception as e:
        return jsonify({'error': f"An error occurred: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
