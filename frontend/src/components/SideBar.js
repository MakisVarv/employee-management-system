import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-2 p-3 rounded w-full ${
      location.pathname === path ? 'bg-gray-700' : 'hover:bg-gray-700'
    }`;

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <h2 className="text-xl p-4 border-b border-gray-700">
        Admin Panel
      </h2>

      <nav className="flex flex-col p-4 space-y-2">
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          📊 Dashboard
        </Link>

        <Link to="/employees" className={linkClass('/employees')}>
          👥 Employees
        </Link>

        <Link to="/users" className={linkClass('/users')}>
          👤 Users
        </Link>
      </nav>
    </div>
  );
}
