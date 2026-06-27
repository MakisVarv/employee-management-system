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
import { useNavigate } from 'react-router-dom';

export default function EmployeePage() {
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
  const navigate = useNavigate();
  const currentQuery = { page, search, type, sort, order };
  useEffect(() => {
    dispatch(fetchEmployees({ page, search, type, sort, order }));
  }, [page, search, type, sort, order, dispatch]);

  const totalPages = Math.ceil(total / 10);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target.result;

      const rows = text.split('\n').map((r) => r.split(','));

      const headers = rows[0];
      const data = rows.slice(1, 6); // 🔥 δείχνει μόνο 5 γραμμές

      const formatted = data.map((row) => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = row[i];
        });
        return obj;
      });

      setPreview(formatted);
    };

    reader.readAsText(selectedFile);
  };

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
  const typeLabels = {
    fulltime: 'Full Time',
    parttime: 'Part Time',
    manager: 'Manager',
  };
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await API.post('/employees/import-csv', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Import successful');
      fetchEmployees();
    } catch (err) {
      alert('Import failed');
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Employees</h1>
      <div className="bg-white rounded-xl shadow p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Search
              </label>
              <input
                value={search}
                placeholder="Search by name..."
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(0);
                }}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setPage(0);
                }}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Types</option>
                <option value="fulltime">Full Time</option>
                <option value="parttime">Part Time</option>
                <option value="manager">Manager</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sort By
              </label>
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(0);
                }}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="id">ID</option>
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Order
              </label>
              <select
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                  setPage(0);
                }}
                className="w-full border rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-sm"
              onClick={() => {
                if (
                  user?.role === 'Admin' ||
                  user?.role === 'Manager'
                ) {
                  navigate('/employees/new');
                } else {
                  setSelected(null);
                  setShowModal(true);
                }
              }}
            >
              + Add Employee
            </button>

            <button
              onClick={handleExport}
              className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm"
            >
              Export CSV
            </button>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
            />
            {preview.length > 0 && (
              <div className="mt-4">
                <h3 className="font-bold mb-2">Preview</h3>

                <table className="w-full border">
                  <thead>
                    <tr>
                      {Object.keys(preview[0]).map((key) => (
                        <th
                          key={key}
                          className="border p-2 bg-gray-100"
                        >
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {preview.map((row, i) => (
                      <tr key={i}>
                        {Object.values(row).map((val, j) => (
                          <td key={j} className="border p-2">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button
              onClick={handleUpload}
              className="bg-purple-500 text-white px-4 py-2 mt-3"
            >
              Import CSV
            </button>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {total} employee{total === 1 ? '' : 's'} found
        </p>

        {loading && (
          <p className="text-sm text-blue-500">
            Loading employees...
          </p>
        )}
      </div>
      {!loading && list.length === 0 && (
        <p className="text-gray-500">No employees found</p>
      )}

      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Department</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {emp.name}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {typeLabels[emp.type] || emp.type}
                    </span>
                  </td>
                  <td className="p-3">
                    {emp.department?.name || '-'}
                  </td>

                  <td className="p-4 text-right">
                    {user?.role === 'User' && (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setSelected(emp);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </button>
                    )}

                    {(user?.role === 'Admin' ||
                      user?.role === 'Manager') && (
                      <div className="inline-flex gap-2">
                        <button
                          className="bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            navigate(`/employees/${emp.id}/edit`);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded"
                          onClick={() => handleDelete(emp.id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        {[...Array(totalPages)].map((_, i) => (
          <button
            className={`px-3 py-1 border rounded-lg ${
              page === i
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white hover:bg-gray-100'
            }`}
            key={i}
            onClick={() => setPage(i)}
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
