import { useEffect, useState, useContext } from 'react';
import API from '../../services/api';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-toastify';

export default function ProfilePage() {
  const { user } = useContext(AuthContext);

  const [form, setForm] = useState({
    username: '',
    email: '',
    role: '',
  });
  const [isSaving, setIsSaving] = useState(false);

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

  const handleSubmit = async () => {
    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email');
      return;
    }

    if (isSaving) return;

    try {
      setIsSaving(true);

      const res = await API.put(`/me/${user.id}`, {
        username: form.username,
        email: form.email.trim(),
      });

      setForm(res.data);
      toast.success('Profile updated');
    } catch (error) {
      // interceptor shows error
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-5">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>

      <div>
        <label className="block text-sm font-medium mb-1">
          Username
        </label>
        <input
          name="username"
          value={form.username}
          readOnly
          className="w-full border rounded px-3 py-2 bg-gray-50 text-gray-600"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          placeholder="Email"
        />
      </div>
      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {isSaving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}
