import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API Register Backend
      await api.post('/auth/register', {
        username,
        email,
        password
      });

      alert("Registrasi Berhasil! Silakan Login.");
      navigate('/login'); // Lempar ke login setelah sukses

    } catch (error: any) {
      console.error("Register Error:", error);
      alert("Gagal Register! Username mungkin sudah dipakai atau password kurang rumit (Wajib: Huruf Besar, Kecil, Angka, Simbol).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">Daftar Akun Baru</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} 
              className="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500" required />
          </div>

          <div className="mb-4">
            <label className="mb-2 block text-sm font-bold text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} 
              className="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500" required />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} 
              className="w-full rounded-md border px-3 py-2 text-gray-700 focus:outline-none focus:border-blue-500" placeholder="Min. 1 Besar, 1 Angka, 1 Simbol" required />
          </div>

          <button type="submit" disabled={loading} className="w-full rounded-md bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700 transition duration-200">
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Sudah punya akun? <Link to="/login" className="text-blue-600 hover:underline">Login di sini</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;