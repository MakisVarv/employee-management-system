import { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: '',
  });

  useEffect(() => {
    API.get(`/me/${user.id}`).then((res) => setForm(res.data));
  }, [user.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    API.put(`/me/${user.id}`, form).then(() =>
      alert('Profile updated!'),
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <input
        name="username"
        value={form.username}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        placeholder="username"
      />

      {/* <input
        name="email"
        value={form.email}
        onChange={handleChange}
        className="w-full p-2 border mb-3 rounded"
        placeholder="Email"
      /> */}

      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}
