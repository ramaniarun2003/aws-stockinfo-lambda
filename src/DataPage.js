import React, { useState, useEffect } from 'react';
import axios from 'axios';

function DataPage() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('https://tqjx7srjkj.execute-api.us-east-1.amazonaws.com/test/stockinfo', {
      headers: {
 // Replace with actual token
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
        console.log(response.data);
       // const parsedData = JSON.parse(response.data);
     //   console.log("Parsed Data: ", parsedData);
      setData(response.data); // Assuming the API returns an array of stock data
    }) 
    .catch(error => {
      setError(error.message);
    });
  }, []); // Fetch data once when the component mounts

  return (
    <div className="data-page">
      <h1>Existing Stock Data</h1>
      {console.log("Current Data: ", data)}



      {data.length === 0 && <p>Loading data...</p>}
      {data.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Company</th>
              <th>Stock Ticker</th>
              <th>No of Shares</th>
              <th>Cost Basis</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.stockid.S}>
                <td>{item.company.S}</td>
                <td>{item.stockticker.S}</td>
                <td>{item.noofshares.S}</td>
                <td>{item.costbasis.S}</td>
                <td>{item.amount.S}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default DataPage;
