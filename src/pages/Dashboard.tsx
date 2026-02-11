import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Beranda</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-lg">Selamat datang, <span className="font-bold">{user}</span>!</p>
        <p className="text-gray-600">Anda berhasil masuk ke sistem.</p>
        <p className="mt-4 text-sm text-gray-500">Di sini nanti kita akan tampilkan Tabel Riwayat Peminjaman (Fitur 3).</p>
      </div>
    </div>
  );
};

export default Dashboard;