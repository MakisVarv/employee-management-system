import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import API from '../../services/api';
import UserModal from './UserModal';

export default function UserList({ users, setUsers }) {
  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { user } = useContext(AuthContext);

  const handleDelete = async (id) => {
    await API.delete(`/users/${id}`);
    setUsers((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div>
      <div className="bg-white rounded-xl shadow p-4">
        {user?.role === 'Admin' && (
          <button
            className="mb-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
            onClick={() => {
              setSelected(null);
              setShowModal(true);
            }}
          >
            + Add User
          </button>
        )}

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-2">Username</th>
              <th className="p-2">Role</th>
              {user?.role === 'Admin' && (
                <th className="p-3">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b">
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.role}</td>
                {user?.role === 'Admin' && (
                  <td className="p-3 space-x-2">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        setSelected(u);
                        setShowModal(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(u.id)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModal && (
        <UserModal
          userToEdit={selected}
          setUsers={setUsers}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
