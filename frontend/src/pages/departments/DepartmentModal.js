import { useState, useEffect } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';

export default function DepartmentModal({
  department,
  onClose,
  refresh,
}) {
  const [name, setName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (department) setName(department.name);
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      toast.error('Department name must be at least 2 characters');
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      if (department) {
        await API.put(`/departments/${department.id}`, {
          name: trimmedName,
        });

        toast.success('Department updated');
      } else {
        await API.post('/departments/', {
          name: trimmedName,
        });

        toast.success('Department added');
      }

      refresh();
      onClose();
    } catch (error) {
      // toast.error('Failed to save department');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-5"
      >
        <div>
          <h2 className="text-xl font-bold">
            {department ? 'Edit Department' : 'Add Department'}
          </h2>
          <p className="text-sm text-gray-500">
            Departments are used to organize employees.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Department Name
          </label>

          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Department name"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
}
