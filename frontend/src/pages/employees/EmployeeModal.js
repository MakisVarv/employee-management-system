import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEmployee,
  updateEmployee,
} from '../../store/employeesSlice';
import { toast } from 'react-toastify';

export default function EmployeeModal({ employee, onClose }) {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (employee) {
      dispatch(updateEmployee({ id: employee.id, data: form }));
      toast.success('Employee updated');
    } else {
      dispatch(addEmployee(form));
      toast.success('Employee added');
    }

    onClose();
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

        <button className="bg-blue-500 text-white px-4 py-2">
          Save
        </button>
      </form>
    </div>
  );
}
