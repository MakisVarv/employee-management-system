import { useEffect, useState } from 'react';
import API from '../../services/api';
import EmployeeList from '../../pages/employees/EmployeeList';

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');

  const fetchEmployees = () => {
    API.get('/employees').then((res) => setEmployees(res.data.data));
  };

  useEffect(() => {
    fetchEmployees();
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
      <EmployeeList />
    </>
  );
}
