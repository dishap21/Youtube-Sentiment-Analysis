import React, { useState } from 'react';
import WordCloud from './Output/WordCloud';
import SentimentTab from './Output/SentimentTab';
import Summary from './Output/Summary';
import Visualization from './Output/Visualization';

export default function Output({ data }) {
  const [selectedTab, setSelectedTab] = useState("SentimentTab");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "SentimentTab":
        return <SentimentTab data={data}/>;
      case "WordCloud":
        return <WordCloud />;
      case "Visualization":
        return <Visualization />;
      case "Summary":
        return <Summary />;
      default:
        return <SentimentTab />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <p className='font-bold text-4xl mb-6 text-center'>Output</p>
      <div className="mb-5">
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select your tab
        </label>
        <select
          id="tabs"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          onChange={(e) => setSelectedTab(e.target.value)}
        >
          <option>SentimentTab</option>
          <option>WordCloud</option>
          <option>Visualization</option>
          <option>Summary</option>
        </select>
      </div>
      <ul className="hidden text-sm font-medium text-center text-gray-500 rounded-lg shadow sm:flex">
        {["SentimentTab", "WordCloud", "Visualization", "Summary"].map((tab) => (
          <li key={tab} className="w-full focus-within:z-10">
            <a
              href="#"
              className={`inline-block w-full p-4 ${
                selectedTab === tab
                  ? "text-gray-900 bg-gray-300"
                  : "bg-white border-gray-200 hover:text-gray-700 hover:bg-gray-50"
              }`}
              onClick={() => setSelectedTab(tab)}
              aria-current={selectedTab === tab ? "page" : undefined}
            >
              {tab}
            </a>
          </li>
        ))}
      </ul>
      <div className="mt-5">{renderTabContent()}</div>
    </div>
    </div>
  );
}
