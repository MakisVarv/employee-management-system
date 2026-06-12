import { useEffect, useState } from 'react';
import API from '../../services/api';
import UserList from './UserList';

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [role, setRole] = useState('');
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(search.toLowerCase()) &&
      (role ? user.role === role : true),
  );

  useEffect(() => {
    setLoading(true);
    API.get('/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch(() => {
        setError('Failed to load users.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          className="p-2 border rounded"
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="User">User</option>
        </select>
      </div>
      {loading && <p>Loading users...</p>}

      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && filteredUsers.length === 0 && (
        <p>No users found.</p>
      )}

      {!loading && !error && filteredUsers.length > 0 && (
        <UserList users={filteredUsers} setUsers={setUsers} />
      )}
    </>
  );
}
