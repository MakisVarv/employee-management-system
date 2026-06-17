import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function DepartmentModal({
  department,
  onClose,
  refresh,
}) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (department) setName(department.name);
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (department) {
      await API.put(`/departments/${department.id}`, {
        name,
      });
    } else {
      await API.post('/departments', { name });
    }

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl mb-4">
          {department ? 'Edit' : 'Add'} Department
        </h2>

        <input
          className="w-full p-2 border mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department name"
        />

        <button className="bg-blue-500 text-white p-2 w-full">
          Save
        </button>

        <button
          type="button"
          onClick={onClose}
          className="mt-2 w-full bg-gray-400 p-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
