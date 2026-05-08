import Sidebar from '../components/SideBar';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  function logOut() {
    logout();
    navigate('/');
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 overflow-auto">
        {/* Top bar */}
        <div className="flex justify-end mb-4">
          <button
            onClick={logOut}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
