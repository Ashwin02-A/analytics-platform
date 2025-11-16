import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/auth/api-key`, { withCredentials: true })
      .then(res => setApiKey(res.data.apiKey));
    axios.get(`${process.env.REACT_APP_API_URL}/api/analytics/event-summary?event=click`)
      .then(res => setSummary(res.data));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p><strong>API Key:</strong> <code>{apiKey}</code></p>
      {summary && (
        <div>
          <h3>Event Summary</h3>
          <pre>{JSON.stringify(summary, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}