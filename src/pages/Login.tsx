import React, { useState } from 'react';
import api from '../services/api'; 
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Menembak API Backend
      const response = await api.post('/auth/login', {
        username: username,
        password: password
      });

      // Jika sukses, simpan Token
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);

      alert("Login Berhasil! Selamat datang.");
      
      // Pindah ke Dashboard
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Login Gagal! Periksa username/password atau pastikan Backend menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Sistem Peminjaman Ruangan
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Username</label>
            <input
              type="text"
              className="w-full rounded-md border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
            <input
              type="password"
              className="w-full rounded-md border px-3 py-2 text-gray-700 focus:border-blue-500 focus:outline-none"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-md px-4 py-2 font-bold text-white transition duration-200 focus:outline-none ${
              loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
            Belum punya akun? <Link to="/register" className="text-blue-600 hover:underline">Daftar di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;