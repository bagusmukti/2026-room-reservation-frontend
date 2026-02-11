import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; 
import api from '../services/api';      
import type { Reservation, UserPayload } from '../types'; // Tipe data

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // State untuk menyimpan data
  const [user, setUser] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Helper: Mengubah angka status menjadi Badge berwarna
  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Pending</span>;
      case 1: return <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Approved</span>;
      case 2: return <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold">Rejected</span>;
      default: return <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">Unknown</span>;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Cek apakah ada token?
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      // Baca isi token (Decode)
      const decoded = jwtDecode<UserPayload>(token);
      setUser(decoded.unique_name);
      setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      
      // Ambil data peminjaman dari Backend
      fetchReservations();

    } catch (error) {
      console.error("Token invalid", error);
      localStorage.clear();
      navigate('/login');
    }
  }, [navigate]);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    // Continer Utama
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      
      {/* Header Dashboard */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard {role}</h1>
          <p className="text-gray-500 mt-1">
            Halo, <span className="font-semibold text-blue-600">{user}</span>! Selamat beraktivitas.
          </p>
        </div>
        
        <button 
          onClick={handleLogout} 
          className="w-full sm:w-auto bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition shadow-sm font-medium"
        >
          Keluar
        </button>
      </div>

      {/* Konten Tabel */}
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        {/* Header Tabel */}
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-800">Riwayat Peminjaman Ruangan</h2>
          
          {/* Tombol Ajukan (Hanya muncul jika User) */}
          {role === 'User' && (
            <button className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm">
              + Ajukan Baru
            </button>
          )}
        </div>

        {/* Wrapper Tabel */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]"> 
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <th className="py-4 px-6">Peminjam</th>
                <th className="py-4 px-6">Ruangan</th>
                <th className="py-4 px-6 text-center">Waktu</th>
                <th className="py-4 px-6 text-center">Keperluan</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-medium">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8">Sedang memuat data...</td></tr>
              ) : reservations.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-gray-400">Belum ada data peminjaman.</td></tr>
              ) : (
                reservations.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                    <td className="py-4 px-6 text-gray-900">{item.borrowerName}</td>
                    <td className="py-4 px-6 text-blue-600">{item.room?.name}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col">
                        <span>{new Date(item.startTime).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 max-w-xs truncate" title={item.purpose}>
                      {item.purpose}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {getStatusLabel(item.status)}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer Tabel (Pagination Placeholder) */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
          Menampilkan {reservations.length} data terbaru.
        </div>
      </div>
    </div>
  );
};

export default Dashboard;