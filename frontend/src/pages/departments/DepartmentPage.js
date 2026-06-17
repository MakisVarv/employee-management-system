import { useEffect, useState } from 'react';
import API from '../../services/api';
import DepartmentModal from './DepartmentModal';

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchDepartments = () => {
    API.get('/departments').then((res) => setDepartments(res.data));
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    await API.delete(`/departments/${id}`);
    fetchDepartments();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Departments</h1>

      <button
        onClick={() => {
          setSelected(null);
          setShowModal(true);
        }}
        className="bg-green-500 text-white px-4 py-2 mb-4"
      >
        + Add Department
      </button>

      <table className="w-full bg-white shadow">
        <thead>
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((d) => (
            <tr key={d.id}>
              <td className="p-3">{d.name}</td>
              <td className="p-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelected(d);
                    setShowModal(true);
                  }}
                  className="bg-blue-500 text-white px-2"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(d.id)}
                  className="bg-red-500 text-white px-2"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <DepartmentModal
          department={selected}
          onClose={() => setShowModal(false)}
          refresh={fetchDepartments}
        />
      )}
    </div>
  );
}
