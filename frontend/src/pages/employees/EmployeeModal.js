import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEmployee,
  updateEmployee,
} from '../../store/employeesSlice';
import { toast } from 'react-toastify';

export default function EmployeeModal({
  employee,
  onClose,
  onSaved,
}) {
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    name: '',
    type: '',
    salary: 0,
    hourly_rate: 0,
    hours: 0,
    bonus: 0,
    team_size: 0,
  });

  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      name: form.name.trim(),
    };

    if (payload.name.length < 2) {
      toast.error('Employee name must be at least 2 characters');
      return;
    }

    if (!payload.type) {
      toast.error('Please select an employee type');
      return;
    }

    try {
      if (employee) {
        await dispatch(
          updateEmployee({ id: employee.id, data: payload }),
        ).unwrap();

        toast.success('Employee updated');
      } else {
        await dispatch(addEmployee(payload)).unwrap();

        toast.success('Employee added');
      }

      await onSaved();
      onClose();
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Failed to save employee',
      );
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded space-y-3"
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Type</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="manager">Manager</option>
        </select>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
        >
          Save
        </button>

        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
