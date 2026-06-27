import KPIs from './KPIs';
import Charts from './Charts';
import { useEffect, useState } from 'react';
import API from '../../services/api';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get('/dashboard/summary')
      .then((res) => setSummary(res.data))
      .catch(() => setError('Failed to load dashboard summary'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {loading && <p>Loading dashboard...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading && !error && (
        <>
          <KPIs summary={summary} />
          <Charts summary={summary} />
        </>
      )}
    </>
  );
}
