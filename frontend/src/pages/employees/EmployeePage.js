import { useEffect, useState } from 'react';
import axios from 'axios';
import EmployeeList from '../../pages/employees/EmployeeList';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    axios
      .get('http://127.0.0.1:8001/employees')
      .then((res) => setEmployees(res.data));
  }, []);

  const filtered = employees.filter((e) => {
    const name = e.name ? e.name.toLowerCase() : '';
    return (
      name.includes(search.toLowerCase()) &&
      (type ? e.type === type : true)
    );
  });

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <div className="flex gap-4 mb-4">
        <input
          placeholder="Search..."
          className="p-2 border rounded"
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="p-2 border rounded"
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="manager">Manager</option>
        </select>
      </div>

      <EmployeeList
        employees={filtered}
        setEmployees={setEmployees}
      />
    </>
  );
}
