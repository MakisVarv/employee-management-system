import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  addEmployee,
  getEmployee,
  updateEmployee,
} from '../../store/employeesSlice';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../../services/api';

function EmployeeForm() {
  const { editId } = useParams();
  const isEditMode = Boolean(editId);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    type: 'fulltime',
    salary: 0,
    hourly_rate: 0,
    hours: 0,
    bonus: 0,
    team_size: 0,
    department_id: '',
  });
  // 📥 LOAD employee αν είναι edit
  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await API.get('/departments/');
        setDepartments(res.data);
      } catch (error) {
        toast.error('Failed to load departments');
      }
    }

    loadDepartments();
    async function loadEmployee() {
      try {
        const emp = await dispatch(getEmployee(editId)).unwrap();
        setForm({
          name: emp.name || '',
          type: emp.type || 'fulltime',
          salary: emp.salary || 0,
          hourly_rate: emp.hourly_rate || 0,
          hours: emp.hours || 0,
          bonus: emp.bonus || 0,
          team_size: emp.team_size || 0,
          department_id: emp.department_id || '',
        });
      } catch (error) {
        toast.error(
          typeof error === 'string'
            ? error
            : 'Failed to get employee',
        );
        navigate('/employees');
      }
    }

    if (isEditMode) {
      loadEmployee();
    }
  }, [dispatch, editId, isEditMode, navigate]);

  const handleChange = (e) => {
    let { name, value, type } = e.target;
    value = type === 'number' ? Number(value) : value;

    setForm((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      if (name === 'type' && value !== 'manager') {
        updated.team_size = 0;
      }

      return updated;
    });
  };
  const validateForm = () => {
    if (form.name.trim().length < 2) {
      toast.error('Employee name must be at least 2 characters');
      return false;
    }

    if (!form.department_id) {
      toast.error('Please select a department');
      return false;
    }

    if (
      Number(form.salary) < 0 ||
      Number(form.hourly_rate) < 0 ||
      Number(form.hours) < 0 ||
      Number(form.bonus) < 0 ||
      Number(form.team_size) < 0
    ) {
      toast.error('Numeric values cannot be negative');
      return false;
    }

    if (
      (form.type === 'fulltime' || form.type === 'manager') &&
      Number(form.salary) <= 0
    ) {
      toast.error(
        'Salary is required for full-time and manager employees',
      );
      return false;
    }

    if (
      form.type === 'parttime' &&
      (Number(form.hourly_rate) <= 0 || Number(form.hours) <= 0)
    ) {
      toast.error(
        'Hourly rate and hours are required for part-time employees',
      );
      return false;
    }

    if (form.type === 'manager' && Number(form.team_size) <= 0) {
      toast.error('Team size is required for managers');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;
    setIsSaving(true);
    const payload = {
      name: form.name.trim(),
      type: form.type,
      salary: Number(form.salary),
      hourly_rate: Number(form.hourly_rate),
      hours: Number(form.hours),
      bonus: Number(form.bonus),
      team_size: form.type === 'manager' ? Number(form.team_size) : 0,
      department_id: form.department_id
        ? Number(form.department_id)
        : null,
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
      if (editId) {
        await dispatch(
          updateEmployee({ id: editId, data: payload }),
        ).unwrap();

        toast.success('Employee updated');
      } else {
        await dispatch(addEmployee(payload)).unwrap();
        toast.success('Employee added');
      }
      navigate('/employees');
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Failed to save employee',
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6">
        {isEditMode ? 'Update Employee' : 'Add Employee'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Name
          </label>
          <input
            name="name"
            placeholder="Employee name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Type
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="fulltime">Full Time</option>
            <option value="parttime">Part Time</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Department
          </label>

          <select
            name="department_id"
            value={form.department_id}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">No department</option>

            {departments.map((department) => (
              <option key={department.id} value={department.id}>
                {department.name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Salary
            </label>
            <input
              name="salary"
              type="number"
              value={form.salary}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hourly Rate
            </label>
            <input
              name="hourly_rate"
              type="number"
              value={form.hourly_rate}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Hours
            </label>
            <input
              name="hours"
              type="number"
              value={form.hours}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Bonus
            </label>
            <input
              name="bonus"
              type="number"
              value={form.bonus}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          {form.type === 'manager' && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Team Size
              </label>
              <input
                name="team_size"
                type="number"
                value={form.team_size}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate('/employees')}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {isSaving
              ? 'Saving...'
              : isEditMode
                ? 'Edit Employee'
                : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EmployeeForm;
