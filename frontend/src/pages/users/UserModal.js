import { useState } from 'react';
import API from '../../services/api';
import { toast } from 'react-toastify';

export default function UserModal({ userToEdit, onClose, setUsers }) {
  const isEditMode = Boolean(userToEdit);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    username: userToEdit?.username || '',
    email: userToEdit?.email || '',
    password: '',
    role: userToEdit?.role || 'User',
  });
  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }
  function validateForm() {
    if (form.username.trim().length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }

    if (!form.email.includes('@')) {
      toast.error('Please enter a valid email');
      return false;
    }

    if (!isEditMode && form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return false;
    }

    if (!form.role) {
      toast.error('Please select a role');
      return false;
    }

    return true;
  }
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
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
        const res = await API.post('/register', {
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        });
        let createdUser = res.data;

        if (form.role !== 'User') {
          await API.put(`/set-role?user_id=${createdUser.id}`, {
            role: form.role,
          });

          createdUser = {
            ...createdUser,
            role: form.role,
          };
        }

        setUsers((prev) => [...prev, createdUser]);
      }

      onClose();
    } catch (err) {
      toast.error('Failed to save user');
    } finally {
      setIsSaving(false);
    }
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md space-y-5">
        <h2 className="text-xl font-bold mb-4">
          {isEditMode ? 'Edit User' : 'Add User'}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Username
              </label>
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                readOnly={isEditMode}
                placeholder="Username"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                E-mail
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                readOnly={isEditMode}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
            </div>
            {!isEditMode && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Password
                </label>

                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border p-2 rounded"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">
                Role
              </label>
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
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 border rounded hover:bg-gray-50"
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
    </div>
  );
}
