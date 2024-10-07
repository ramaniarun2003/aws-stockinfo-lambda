import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataPage from './DataPage';
import './App.css';  // Import your CSS file

function App() {
  const [formData, setFormData] = useState({
    stockid: '',
    company: '',
    stockticker: '',
    noofshares: '',
    costbasis: '',
    dividend: '',
    amount: '',
    stockclassification: ''
  });
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://tqjx7srjkj.execute-api.us-east-1.amazonaws.com/test/stockinfo', formData, {
      headers: {
        'x-client-id': 'eis-postman-test',
        'Authorization': 'Bearer YOUR_TOKEN_HERE',  // Replace with actual token
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log(response.data);
      setResponseData(response.data);
      setError(null);
    })
    .catch(error => {
      setError(error.message);
    });
  };

  return (
    <Router>
      <div className="form-container">
        <h1>Submit Stock Info</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Stock ID:</label>
            <input
              type="text"
              name="stockid"
              value={formData.stockid}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Company:</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Ticker:</label>
            <input
              type="text"
              name="stockticker"
              value={formData.stockticker}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>No of Shares:</label>
            <input
              type="number"
              name="noofshares"
              value={formData.noofshares}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Cost Basis:</label>
            <input
              type="number"
              name="costbasis"
              value={formData.costbasis}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Dividend:</label>
            <input
              type="number"
              name="dividend"
              value={formData.dividend}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Amount:</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Stock Classification:</label>
            <input
              type="text"
              name="stockclassification"
              value={formData.stockclassification}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </form>

        {responseData && (
          <div>
            <h2>Response from API:</h2>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </div>
        )}

        {error && <div className="error">Error: {error}</div>}

        <Link to="/data">
          <button className="submit-btn" style={{ marginTop: '20px' }}>View Existing Data</button>
        </Link>

        <Routes>
          <Route path="/data" element={<DataPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
