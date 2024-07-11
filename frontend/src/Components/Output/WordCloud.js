import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WordCloud({data}) {
  const [wordcloud, setWordcloud] = useState(null);

  useEffect (() => {
    const wc = async () => {
      try{
        const response = await axios.post('http://127.0.0.1:5000/wordcloud', {data: data}, { responseType: 'blob' });
        const imageUrl = URL.createObjectURL(response.data);
        console.log('Response received:', response);
        setWordcloud(imageUrl);
      }catch(err){
        console.error('Error fetching wordcloud',)
      }
    }
    if(data){
      wc();
    }
  }, [data]);

  return (
    <div>
      {wordcloud ? (
        <img src={wordcloud} alt='Word Cloud' />
      ) : (
        <p>Something went wrong.</p>
      )}
    </div>
  )
}
