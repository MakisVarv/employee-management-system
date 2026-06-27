import { useState, useEffect } from 'react';
import API from '../../services/api';
import { useDispatch } from 'react-redux';
import { updateEmployee } from '../../store/employeesSlice';
import { toast } from 'react-toastify';

export default function EmployeeModal({
  employee,
  onClose,
  onSaved,
}) {
  const dispatch = useDispatch();
  const [departments, setDepartments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    API.get('/departments/').then((res) => setDepartments(res.data));
  }, []);

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
    if (employee) {
      setForm({
        name: employee.name || '',
        type: employee.type || '',
        salary: employee.salary || 0,
        hourly_rate: employee.hourly_rate || 0,
        hours: employee.hours || 0,
        bonus: employee.bonus || 0,
        team_size: employee.team_size || 0,
        department_id: employee.department_id || '',
      });
    }
  }, [employee]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.department_id) {
      toast.error('Please select a department');
      return;
    }
    const payload = {
      name: form.name.trim(),
      type: form.type,
      salary: Number(form.salary),
      hourly_rate: Number(form.hourly_rate),
      hours: Number(form.hours),
      bonus: Number(form.bonus),
      team_size: form.type === 'manager' ? Number(form.team_size) : 0,
      department_id: Number(form.department_id),
    };
    if (payload.name.length < 2) {
      toast.error('Employee name must be at least 2 characters');
      return;
    }

    try {
      setIsSaving(true);
      if (employee) {
        await dispatch(
          updateEmployee({ id: employee.id, data: payload }),
        ).unwrap();

        toast.success('Employee updated');
      }
      await onSaved();
      onClose();
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Failed to save employee',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Employee Name
          </label>

          <input
            placeholder="Employee name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Employee Type
          </label>

          <div className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-700">
            {form.type === 'fulltime'
              ? 'Full Time'
              : form.type === 'parttime'
                ? 'Part Time'
                : form.type === 'manager'
                  ? 'Manager'
                  : 'Unknown'}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Department
          </label>

          <select
            className="w-full border rounded px-3 py-2"
            value={form.department_id}
            onChange={(e) =>
              setForm({ ...form, department_id: e.target.value })
            }
          >
            <option value="" disabled>
              Select Department
            </option>

            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
