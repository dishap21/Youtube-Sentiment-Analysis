import numpy as np
import pandas as pd
import nltk
import string
import emoji
from langdetect import detect
from googletrans import Translator
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.stem import WordNetLemmatizer
from sklearn.feature_extraction.text import CountVectorizer

nltk.download('stopwords')
nltk.download('punkt')
nltk.download('wordnet')

stop_words = set(stopwords.words('english'))
lemmatizer = WordNetLemmatizer()
cv = CountVectorizer()

def remove_punctuations(text):
    for punctuation in string.punctuation:
        text = text.replace(punctuation, '')
    return text

def preprocess_text(text):
    text = remove_punctuations(text)
    text = text.lower()
    text = emoji.demojize(text)
    tokens = word_tokenize(text)
    tokens = [item for item in tokens if item not in stop_words]
    tokens = [lemmatizer.lemmatize(item) for item in tokens]
    return ' '.join(tokens)

def filter_and_translate(comments):
    translator = Translator()
    filtered_comments = []

    for comment in comments:
        try:
            lang = detect(comment)
            if lang == 'en':
                filtered_comments.append(comment)
            elif lang == 'hi':  # Assuming Hinglish comments will be detected as Hindi
                translated_comment = translator.translate(comment, src='hi', dest='en').text
                filtered_comments.append(translated_comment)
        except:
            continue

    return filtered_comments
