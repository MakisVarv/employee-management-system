import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(form);
    navigate('/dashboard');
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow w-80"
      >
        <h2 className="text-xl mb-4">Login</h2>

        <input
          className="w-full mb-2 p-2 border"
          placeholder="Username"
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full mb-4 p-2 border"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}
