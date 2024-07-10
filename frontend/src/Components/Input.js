import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink } from '@fortawesome/free-solid-svg-icons'
import Spinner from './Spinner';
import Output from './Output';

export default function Input() {
  const [videoUrl, setVideoUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      const res = await axios.post('http://127.0.0.1:5000/analyze', {video_url: videoUrl});
      setResponse(res.data);
    }catch(err){
      console.log(err);
    }finally{
      setIsLoading(false);
    }
  }


  return (
    <div className="flex flex-col items-center justify-center m-3">
      { isLoading ? (
        <div>
          <Spinner />
        </div>
      ): (
      <form onSubmit={handleSubmit} className="my-10 w-full max-w-sm p-4 bg-slate-400 border border-gray-300 rounded-lg shadow sm:p-6 md:w-2/3">
        <label 
          className="block mb-3 text-xl font-semibold text-gray-800"
        >
          Enter URL:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
            <FontAwesomeIcon icon={faLink} className='w-5 h-5 text-slate-600'/>
          </div>
          <input 
            type="text" 
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5"
            placeholder="https://www.youtube.com/watch?XXXXX"

          />
        </div>
        <button
            type="submit"
            className="w-full bg-blue-700 border-2 border-blue-400 text-white mt-3 py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
      </form>
      )}
      {response && <Output data={response}/> }
    </div>
  )
}
