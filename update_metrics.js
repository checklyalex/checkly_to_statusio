const axios = require('axios');
const moment = require('moment');
require('dotenv').config()

function convertPayload(apiPayload) {
  const convertedPayload = {
    statuspage_id: process.env.STATUSPAGE_ID,
    metric_id: process.env.STATUSPAGE_METRIC,
    day_avg: `50.0`,
    day_start: `${moment(apiPayload.from).valueOf()}`,
    day_dates: [],
    day_values: [],
    week_avg: "20.07",
    week_start: "1395463478000",
    week_dates: [
    "2014-03-22T04:43:00+00:00",
    "2014-03-23T04:43:00+00:00",
    "2014-03-24T04:43:00+00:00",
    "2014-03-25T04:43:00+00:00",
    "2014-03-26T04:43:00+00:00",
    "2014-03-27T04:43:00+00:00",
    "2014-03-28T04:43:00+00:00"
    ],
    week_values: [
    "23.10",
    "22.10",
    "22.20",
    "22.30",
    "22.10",
    "18.70",
    "17.00"
    ],
    month_avg: "10.63",
    month_start: "1393476280000",
    month_dates: [
    "2014-02-28T04:43:00+00:00",
    "2014-03-01T04:43:00+00:00",
    "2014-03-02T04:43:00+00:00",
    "2014-03-03T04:43:00+00:00",
    "2014-03-04T04:43:00+00:00",
    "2014-03-05T04:43:00+00:00",
    "2014-03-06T04:43:00+00:00",
    "2014-03-07T04:43:00+00:00",
    "2014-03-08T04:43:00+00:00",
    "2014-03-09T04:43:00+00:00",
    "2014-03-10T04:43:00+00:00",
    "2014-03-11T04:43:00+00:00",
    "2014-03-12T04:43:00+00:00",
    "2014-03-13T04:43:00+00:00",
    "2014-03-14T04:43:00+00:00",
    "2014-03-15T04:43:00+00:00",
    "2014-03-16T04:43:00+00:00",
    "2014-03-17T04:43:00+00:00",
    "2014-03-18T04:43:00+00:00",
    "2014-03-19T04:43:00+00:00",
    "2014-03-20T04:43:00+00:00",
    "2014-03-21T04:43:00+00:00",
    "2014-03-22T04:43:00+00:00",
    "2014-03-23T04:43:00+00:00",
    "2014-03-24T04:43:00+00:00",
    "2014-03-25T04:43:00+00:00",
    "2014-03-26T04:43:00+00:00",
    "2014-03-27T04:43:00+00:00",
    "2014-03-28T04:43:00+00:00"
    ],
    month_values: [
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "0.00",
    "18.50",
    "18.60",
    "18.40",
    "16.60",
    "16.80",
    "17.90",
    "19.90",
    "21.30",
    "22.80",
    "20.00",
    "17.30",
    "19.10",
    "21.50",
    "22.40",
    "22.50",
    "22.00",
    "21.80"
    ]
    };

  apiPayload.series[0].data.forEach(data => {
    const formattedDate = moment(data.peridoT).format();
    convertedPayload.day_dates.push(formattedDate);
    convertedPayload.day_values.push(data.responseTime_avg.toFixed(2));
  });

  return convertedPayload;
}

// Function to call the Checkly API and convert the payload
async function convertAPI1Data(api1URL) {
    try {
      const headers = {
        'x-checkly-account': process.env.CHECKLY_ACCOUNT_ID,
        'Authorization': `Bearer ${process.env.CHECKLY_API_KEY}` 
      };
  
      const response = await axios.get(api1URL, { headers });
      const convertedPayload = convertPayload(response.data);
      return convertedPayload;
    } catch (error) {
      console.error('Error calling API 1:', error);
      throw error;
    }
  }
  
// Function to call the second API endpoint to update the custom metric
async function callAPI2(api2URL, convertedPayload) {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-api-id': process.env.STATUSIO_ID,
        'x-api-key': process.env.STATUSIO_API_KEY
      };
  
      const response = await axios.post(api2URL, convertedPayload, { headers });
      console.log('API 2 response:', response.data);
    } catch (error) {
      console.error('Error calling API 2:', error);
      throw error;
    }
  }

// Usage example:
const api1URL = `https://api.checklyhq.com/v1/analytics/api-checks/${process.env.CHECKLY_CHECK_ID}?from=1682872776&to=1686159576&aggregationInterval=1440&metrics=responseTime_avg&limit=30&page=1`; 
const api2URL = 'https://api.status.io/v2/metric/update'; 

convertAPI1Data(api1URL)
  .then(convertedPayload => callAPI2(api2URL, convertedPayload))
  .catch(error => {
    // Handle errors
  });
