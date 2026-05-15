import { useContext, useState } from 'react';
import API from '../../services/api';
import EmployeeModal from './EmployeeModal';
import { AuthContext } from '../../context/AuthContext';

export default function EmployeeList({
  employees = [],
  setEmployees,
  refresh,
}) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  // 🔥 DELETE (χωρίς reload)
  const handleDelete = async (id) => {
    await API.delete(`/employees/${id}`);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      {/* ➕ ADD */}
      <button
        className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
        onClick={() => setShowModal(true)}
      >
        + Add Employee
      </button>

      {/* 📋 TABLE */}
      <div className="bg-white shadow rounded overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.type}</td>

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

                  {(user?.role === 'Manager' ||
                    user?.role === 'Admin') && (
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔥 MODAL */}
      {showModal && (
        <EmployeeModal
          employee={selected}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
          refresh={refresh}
        />
      )}
    </div>
  );
}
