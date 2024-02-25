import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';

function App() {
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [evaluation, setEvaluation] = useState('');

  const fetchData = () => {
    axios.get(`http://localhost:5000/get_historical_data?symbol=${symbol}`)
      .then(response => {
        console.log('Response:', response);
        const rawData = response.data;
        console.log('Raw data:', rawData);

        if (Array.isArray(rawData)) {
          const formattedData = rawData.map(entry => ({
            date: new Date(entry.Date),
            open: entry.Open,
            high: entry.High,
            low: entry.Low,
            close: entry.Close
          }));
          setData(formattedData);
        } else {
          console.error('Invalid data format:', rawData);
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const predictionCorrect = evaluatePrediction();
    setEvaluation(predictionCorrect ? 'Correct' : 'Incorrect');
  };

  const evaluatePrediction = () => {
    const timestamp75PercentIndex = Math.floor(data.length * 0.75);
    const priceAt75Percent = data[timestamp75PercentIndex].close;

    const priceAtEnd = data[data.length - 1].close;
    const isPriceHigher = priceAtEnd > priceAt75Percent;

    if ((prediction === 'up' && isPriceHigher) || (prediction === 'down' && !isPriceHigher)) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Stock Market Prediction Game</h1>
      <div className="mb-4">
        <input type="text" placeholder="Enter Stock Symbol" value={symbol} onChange={(e) => setSymbol(e.target.value)} className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500" />
        <button onClick={fetchData} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600">Fetch Data</button>
      </div>
      {data.length > 0 && !evaluation && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Historical Data</h2>
          <LineChart width={800} height={400} data={data.slice(0, Math.floor(data.length * 0.75))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#8884d8" />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" />
            <Line type="monotone" dataKey="low" stroke="#ffc658" />
            <Line type="monotone" dataKey="close" stroke="#ff7300" />
            <ReferenceLine y={data[Math.floor(data.length * 0.75)].close} stroke="red" />
          </LineChart>
          <form onSubmit={handleSubmit} className="mt-4">
            <label className="mr-2">
              Predict: 
              <select value={prediction} onChange={(e) => setPrediction(e.target.value)} className="ml-2 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500">
                <option value="up">Up</option>
                <option value="down">Down</option>
              </select>
            </label>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-lg focus:outline-none hover:bg-blue-600">Submit Prediction</button>
          </form>
        </div>
      )}
      {evaluation && (
        <div>
          <p className="text-xl font-bold mb-4">Evaluation: {evaluation}</p>
          <p className="text-xl font-bold mb-2">Here's the full graph:</p>
          <LineChart width={800} height={400} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#8884d8" />
            <Line type="monotone" dataKey="high" stroke="#82ca9d" />
            <Line type="monotone" dataKey="low" stroke="#ffc658" />
            <Line type="monotone" dataKey="close" stroke="#ff7300" />
            <ReferenceLine y={data[Math.floor(data.length * 0.75)].close} stroke="red" />
            <ReferenceLine y={data[data.length - 1].close} stroke="green" />
          </LineChart>
        </div>
      )}
    </div>
  );
}

export default App;
