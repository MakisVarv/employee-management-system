import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API = 'http://127.0.0.1:8001';

function Home() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    axios
      .get(`${API}/employees`)
      .then((res) => setEmployees(res.data));
  }, []);

  return (
    <div>
      <h1>Employees</h1>

      <Link to="/add">➕ Add Employee</Link>

      {employees.map((emp) => (
        <div key={emp.id}>
          <h3>{emp.name}</h3>
          <p>{emp.type}</p>

          <Link to={`/edit/${emp.id}`}>Edit</Link>
        </div>
      ))}
    </div>
  );
}

export default Home;
