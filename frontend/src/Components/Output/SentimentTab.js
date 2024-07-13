import React from 'react'

export default function SentimentTab({data}) {

  const tell_sentiment = (senti) => {
    if(senti === -1){
      return <p className='text-red-600'>'Negative'</p>
    }else if(senti === 0){
      return <p className='text-yellow-300'>'Neutral'</p>
    }else{
      return <p className='text-green-500'>'Positive'</p>
    }
  }

  return (
    <div className='w-screen'>
        {data ? (
        <div id='table' className='flex justify-center w-full'>
          <table className='w-3/4 border-2 border-slate-300 divide-y divide-gray-200 table-auto'>
            <thead className='bg-gray-200'>
              <tr>
                <th className='px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>Text</th>
                <th className='px-6 py-3 text-left text-base font-medium text-gray-500 uppercase tracking-wider'>Sentiment</th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {data.map((comment, index) => (
                <tr key={index}>
                  <td className='px-6 py-4 text-sm text-gray-900 max-w-xs truncate' style={{ maxWidth: '300px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {comment.Comment}
                  </td>
                  <td className='px-6 py-4 text-sm text-gray-900' style={{ maxWidth: '100px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {tell_sentiment(comment.Sentiment)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center">
          <p>Please try again.</p>
        </div>
      )}
    </div>
  )
}
