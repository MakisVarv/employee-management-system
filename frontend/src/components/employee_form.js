import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const API = 'http://127.0.0.1:8001';

function EmployeeForm({ editId }) {
  const [form, setForm] = useState({
    name: '',
    type: 'fulltime',
    salary: 0,
    hourly_rate: 0,
    hours: 0,
    bonus: 0,
    team_size: 0,
  });

  const navigate = useNavigate();

  // 📥 LOAD employee αν είναι edit
  useEffect(() => {
    if (editId) {
      axios
        .get(`${API}/employees/${editId}`)
        .then((res) => setForm(res.data));
    }
  }, [editId]);

  const handleChange = (e) => {
    const value =
      e.target.type === 'number'
        ? Number(e.target.value)
        : e.target.value;

    setForm({
      ...form,
      [e.target.name]: value,
    });
  };

  const handleSubmit = () => {
    if (editId) {
      axios
        .put(`${API}/employees/${editId}`, form)
        .then(() => navigate('/'));
    } else {
      axios.post(`${API}/employees`, form).then(() => navigate('/'));
    }
  };

  return (
    <div>
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />

      <select name="type" value={form.type} onChange={handleChange}>
        <option value="fulltime">Full Time</option>
        <option value="parttime">Part Time</option>
        <option value="manager">Manager</option>
      </select>

      <input
        name="salary"
        type="number"
        value={form.salary}
        onChange={handleChange}
      />
      <input
        name="hourly_rate"
        type="number"
        value={form.hourly_rate}
        onChange={handleChange}
      />
      <input
        name="hours"
        type="number"
        value={form.hours}
        onChange={handleChange}
      />
      <input
        name="bonus"
        type="number"
        value={form.bonus}
        onChange={handleChange}
      />
      <input
        name="team_size"
        type="number"
        value={form.team_size}
        onChange={handleChange}
      />

      <button onClick={handleSubmit}>
        {editId ? 'Update' : 'Add'}
      </button>
    </div>
  );
}

export default EmployeeForm;
