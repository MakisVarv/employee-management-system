import { useState, useEffect } from 'react';
import API from '../../services/api';

export default function EmployeeModal({
  employee,
  onClose,
  refresh,
}) {
  const [form, setForm] = useState({
    name: '',
    type: '',
    salary: '',
    hourly_rate: '',
    hours: '',
    bonus: '',
    team_size: '',
  });

  useEffect(() => {
    if (employee) setForm(employee);
  }, [employee]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name,
      type: form.type,
      salary: Number(form.salary) || 0,
      hourly_rate: Number(form.hourly_rate) || 0,
      hours: Number(form.hours) || 0,
      bonus: Number(form.bonus) || 0,
      team_size: Number(form.team_size) || 0,
    };

    if (employee) {
      await API.delete(`/employees/${employee.id}`);
    }

    await API.post('/employees', payload);

    refresh();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-96 space-y-3"
      >
        <h2 className="text-xl font-bold">
          {employee ? 'Edit' : 'Add'} Employee
        </h2>

        {/* NAME */}
        <input
          className="w-full p-2 border rounded"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* TYPE */}
        <select
          className="w-full p-2 border rounded"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="">Select Type</option>
          <option value="Manager">Manager</option>
          <option value="Worker">Worker</option>
          <option value="Employee">Employee</option>
        </select>

        {/* SALARY */}
        {form.type === 'Employee' && (
          <input
            className="w-full p-2 border rounded"
            placeholder="Salary"
            type="number"
            value={form.salary}
            onChange={(e) =>
              setForm({ ...form, salary: e.target.value })
            }
          />
        )}

        {/* WORKER */}
        {form.type === 'Worker' && (
          <>
            <input
              className="w-full p-2 border rounded"
              placeholder="Hourly Rate"
              type="number"
              value={form.hourly_rate}
              onChange={(e) =>
                setForm({ ...form, hourly_rate: e.target.value })
              }
            />

            <input
              className="w-full p-2 border rounded"
              placeholder="Hours"
              type="number"
              value={form.hours}
              onChange={(e) =>
                setForm({ ...form, hours: e.target.value })
              }
            />
          </>
        )}

        {/* MANAGER */}
        {form.type === 'Manager' && (
          <>
            <input
              className="w-full p-2 border rounded"
              placeholder="Bonus"
              type="number"
              value={form.bonus}
              onChange={(e) =>
                setForm({ ...form, bonus: e.target.value })
              }
            />

            <input
              className="w-full p-2 border rounded"
              placeholder="Team Size"
              type="number"
              value={form.team_size}
              onChange={(e) =>
                setForm({ ...form, team_size: e.target.value })
              }
            />
          </>
        )}

        {/* BUTTONS */}
        <div className="flex justify-between pt-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
