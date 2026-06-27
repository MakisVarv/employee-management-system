import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const linkClass = (path) =>
    `flex items-center gap-2 p-3 rounded w-full ${
      location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <h2 className="text-xl p-4 border-b border-gray-700">
        {user ? `${user.role} Panel` : 'Panel'}
      </h2>

      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/profile" className={linkClass('/profile')}>
          👤 Profile
        </Link>
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          📊 Dashboard
        </Link>

        <Link to="/employees" className={linkClass('/employees')}>
          👥 Employees
        </Link>

        {(user?.role === 'Manager' || user?.role === 'Admin') && (
          <Link to="/users" className={linkClass('/users')}>
            👤 Users
          </Link>
        )}
        <Link to="/departments" className={linkClass('/departments')}>
          🏦 Departments
        </Link>
      </nav>
    </div>
  );
}
