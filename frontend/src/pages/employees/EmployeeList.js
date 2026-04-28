import { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import EmployeeModal from './EmployeeModal';
import { AuthContext } from '../../context/AuthContext';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  const fetchEmployees = async () => {
    const res = await API.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/employees/${id}`);
    fetchEmployees();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>

      <button
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        onClick={() => setShowModal(true)}
      >
        + Add Employee
      </button>

      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Position</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.position}</td>

                <td className="p-3 space-x-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    onClick={() => {
                      setSelected(emp);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  {user?.role === 'Manager' ||
                  user?.role === 'Admin' ? (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <EmployeeModal
          employee={selected}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
          refresh={fetchEmployees}
        />
      )}
    </div>
  );
}
