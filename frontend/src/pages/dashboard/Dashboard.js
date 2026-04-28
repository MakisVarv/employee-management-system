import EmployeeList from '../employees/EmployeeList';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

export default function Dashboard() {
  const { logout } = useContext(AuthContext);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-gray-900 text-white flex flex-col">
        <h2 className="text-xl p-4 border-b border-gray-700">
          Admin Panel
        </h2>

        <nav className="flex-1 p-4 space-y-2">
          <div className="p-2 hover:bg-gray-700 cursor-pointer">
            Employees
          </div>
        </nav>

        <button
          onClick={logout}
          className="m-4 bg-red-500 p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <EmployeeList />
      </div>
    </div>
  );
}
