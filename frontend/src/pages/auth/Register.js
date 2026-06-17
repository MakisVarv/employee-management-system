import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await register(form);
    navigate('/');
  };
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow w-80"
      >
        <h2 className="text-xl mb-4">Register</h2>

        <input
          className="w-full mb-2 p-2 border"
          placeholder="Username"
          name="username"
          onChange={handleChange}
        />
        <input
          className="w-full mb-2 p-2 border"
          placeholder="Email"
          name="email"
          type="email"
          onChange={handleChange}
        />
        <input
          type="password"
          className="w-full mb-4 p-2 border"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />

        <button className="w-full bg-green-500 text-white p-2">
          Register
        </button>
      </form>
    </div>
  );
}
