import { useEffect, useState } from 'react';
import API from '../../services/api';
import DepartmentModal from './DepartmentModal';

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDepartments = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/departments/');
      setDepartments(res.data);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this department?',
    );

    if (!confirmed) return;

    try {
      await API.delete(`/departments/${id}`);
      fetchDepartments();
    } catch (error) {}
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Departments</h1>
          <p className="text-sm text-gray-500">
            Manage company departments used for employee assignment.
          </p>
        </div>

        <button
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Department
        </button>
      </div>
      {isLoading && (
        <p className="text-sm text-gray-500">
          Loading departments...
        </p>
      )}

      {!isLoading && departments.length === 0 && (
        <div className="bg-white border rounded p-6 text-center text-gray-500">
          No departments found.
        </div>
      )}
      {!isLoading && departments.length > 0 && (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 text-left text-sm text-gray-600">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{d.name}</td>
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setSelected(d);
                          setShowModal(true);
                        }}
                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(d.id)}
                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
