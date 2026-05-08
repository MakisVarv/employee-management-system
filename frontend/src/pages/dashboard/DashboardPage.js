import KPIs from './KPIs';
import Charts from './Charts';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8001/employees')
      .then((res) => setEmployees(res.data));
  }, []);

  return (
    <>
      <KPIs employees={employees} />
      <Charts employees={employees} />
    </>
  );
}
