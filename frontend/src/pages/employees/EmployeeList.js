import { useContext, useEffect, useState } from 'react';
import EmployeeModal from './EmployeeModal';
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  fetchEmployees,
  deleteEmployee,
} from '../../store/employeesSlice';
import API from '../../services/api';

export default function EmployeeList() {
  const dispatch = useDispatch();
  const { list, total, loading } = useSelector(
    (state) => state.employees,
  );
  const { user } = useContext(AuthContext);

  const [selected, setSelected] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('id');
  const [order, setOrder] = useState('asc');

  const currentQuery = { page, search, type, sort, order };
  useEffect(() => {
    dispatch(fetchEmployees({ page, search, type, sort, order }));
  }, [page, search, type, sort, order, dispatch]);

  const totalPages = Math.ceil(total / 10);

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteEmployee(id)).unwrap();
      await dispatch(fetchEmployees(currentQuery)).unwrap();
      toast.success('Employee deleted');
    } catch (error) {
      toast.error(
        typeof error === 'string'
          ? error
          : 'Failed to delete employee',
      );
    }
  };

  const handleExport = async () => {
    try {
      const res = await API.get('/employees/export', {
        responseType: 'blob',
      });

      const blob = new Blob([res.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'employees.csv';
      a.click();

      window.URL.revokeObjectURL(url);

      toast.success('CSV exported');
    } catch (error) {
      toast.error('Failed to export CSV');
    }
  };
  return (
    <div>
      <div>
        <input
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <select
          onChange={(e) => {
            setType(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All</option>
          <option value="fulltime">Full Time</option>
          <option value="parttime">Part Time</option>
          <option value="manager">Manager</option>
        </select>
        <select
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="id">ID</option>
          <option value="name">Name</option>
        </select>

        <select
          onChange={(e) => {
            setOrder(e.target.value);
            setPage(0);
          }}
        >
          <option value="asc">ASC</option>
          <option value="desc">DESC</option>
        </select>
      </div>
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      {loading && (
        <p className="text-blue-500 mb-4">Loading employees...</p>
      )}
      {!loading && list.length === 0 && (
        <p className="text-gray-500">No employees found</p>
      )}
      <div>
        <button
          className="mb-4 bg-green-500 text-white px-4 py-2 rounded"
          onClick={() => setShowModal(true)}
        >
          + Add Employee
        </button>
        <button
          onClick={handleExport}
          className="bg-indigo-500 text-white px-4 py-2 rounded mb-4"
        >
          Export CSV
        </button>
      </div>

      <div className="bg-white shadow rounded">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((emp) => (
              <tr key={emp.id}>
                <td className="p-3">{emp.name}</td>
                <td className="p-3">{emp.type}</td>

                <td className="p-3 space-x-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => {
                      setSelected(emp);
                      setShowModal(true);
                    }}
                  >
                    Edit
                  </button>

                  {(user?.role === 'Admin' ||
                    user?.role === 'Manager') && (
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(emp.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-3 py-1 border rounded ${
              page === i ? 'bg-blue-500 text-white' : ''
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {showModal && (
        <EmployeeModal
          employee={selected}
          onSaved={() => dispatch(fetchEmployees(currentQuery))}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
        />
      )}
    </div>
  );
}
