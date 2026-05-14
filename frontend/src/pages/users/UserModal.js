import { useState } from 'react';
import API from '../../services/api';

export default function UserModal({ userToEdit, onClose, setUsers }) {
  const isEditMode = Boolean(userToEdit);

  const [form, setForm] = useState({
    username: userToEdit?.username || '',
    password: '',
    role: userToEdit?.role || 'User',
  });
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isEditMode) {
        await API.put(`/set-role?user_id=${userToEdit.id}`, {
          role: form.role,
        });

        setUsers((prev) =>
          prev.map((user) =>
            user.id === userToEdit.id
              ? { ...user, role: form.role }
              : user,
          ),
        );
      } else {
        const res = await API.post('/register', form);

        setUsers((prev) => [...prev, res.data]);
      }

      onClose();
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit User' : 'Add User'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              readOnly={isEditMode}
              placeholder="Username"
              className="w-full border p-2 rounded"
            />

            {!isEditMode && (
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full border p-2 rounded"
              />
            )}

            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="User">User</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
