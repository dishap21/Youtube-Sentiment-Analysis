import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";

export default function Visualization({ data }) {
  const [sentimentData, setSentimentData] = useState(null);

  useEffect(() => {
    const processSentimentData = () => {
      const positiveCount = data.filter((row) => row.Sentiment === 1).length;
      const negativeCount = data.filter((row) => row.Sentiment === -1).length;
      const neutralCount = data.filter((row) => row.Sentiment === 0).length;

      setSentimentData({
        positive: positiveCount,
        negative: negativeCount,
        neutral: neutralCount,
      });
    };

    if (data) {
      processSentimentData();
    }
  }, [data]);

  if (!sentimentData) {
    return <div>Something went wrong...</div>;
  }

  const barData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        label: "Sentiment Count",
        data: [
          sentimentData.positive,
          sentimentData.negative,
          sentimentData.neutral,
        ],
        backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56"],
        borderColor: ["#36a2eb", "#ff6384", "#ffcd56"],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          sentimentData.positive,
          sentimentData.negative,
          sentimentData.neutral,
        ],
        backgroundColor: ["#36a2eb", "#ff6384", "#ffcd56"],
        hoverBackgroundColor: ["#36a2eb", "#ff6384", "#ffcd56"],
      },
    ],
  };

  return (
    <div className="flex flex-col items-center w-screen">
      <p className="pt-3 pb-2 font-semibold text-lg"> Bar Chart</p>
      <div className="w-1/2 h-80">
        <Bar data={barData} options={{ maintainAspectRatio: false }} />
      </div>
      <p className="pt-3 pb-2 font-semibold text-lg"> Pie Chart</p>
      <div className="w-1/2 h-80">
        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
