import React from 'react'

export default function SentimentTab({data}) {

  const tell_sentiment = (senti) => {
    if(senti === 0){
      return 'Negative'
    }else if(senti === 1){
      return 'Neutral'
    }else{
      return 'Positive'
    }
  }

  return (
    <div>
        {data ? (
        <div id='table' className="overflow-x-auto">
          <table className='min-w-full border-2 border-slate-300 divide-y divide-gray-200 table-auto'>
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
