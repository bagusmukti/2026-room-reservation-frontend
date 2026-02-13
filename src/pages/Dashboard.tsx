import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';
import type { Reservation, UserPayload } from '../types';
import ReservationModal from '../components/ReservationModal';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState<string>('');
  const [usernameDisplay, setUsernameDisplay] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState(''); 
  const [statusFilter, setStatusFilter] = useState('all'); 

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
    const storedName = localStorage.getItem('username');
    if (storedName) setUsernameDisplay(storedName);

    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const decoded = jwtDecode<UserPayload>(token);
      setUser(decoded.unique_name);
      setRole(decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
      fetchReservations();
    } catch (error) {
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

  const handleOpenDetail = (item: Reservation) => {
    setSelectedReservation(item);
    setIsModalOpen(true);
  };

  const handleApprove = async (id: number) => {
    if(!confirm("Yakin ingin menyetujui peminjaman ini?")) return;
    setActionLoading(true);
    try {
      await api.put(`/reservations/${id}/status`, { status: 1 });
      alert("Berhasil disetujui!");
      setIsModalOpen(false);
      fetchReservations();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal memproses.";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id: number) => {
    if(!confirm("Yakin ingin menolak peminjaman ini?")) return;
    setActionLoading(true);
    try {
      await api.put(`/reservations/${id}/status`, { status: 2 });
      alert("Berhasil ditolak.");
      setIsModalOpen(false);
      fetchReservations();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Gagal memproses.";
      alert(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Yakin ingin menghapus data ini secara permanen?")) return;
    setLoading(true);
    try {
        await api.delete(`/reservations/${id}`);
        alert("Data berhasil dihapus.");
        fetchReservations();
    } catch (error: any) {
        console.error("Gagal hapus", error);
        alert(error.response?.data?.message || "Gagal menghapus data.");
        setLoading(false);
    }
  };

  const filteredReservations = reservations.filter((item) => {
    const matchesSearch = 
      item.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.room?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' || 
      item.status.toString() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard {role}</h1>
          <p className="text-gray-500 mt-1">
            Halo, selamat datang <span className="font-semibold text-blue-600">{usernameDisplay || user}</span>!
          </p>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          {role === 'Admin' && (
            <button onClick={() => navigate('/rooms')} className="flex-1 sm:flex-none bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition shadow-sm font-medium">
              Kelola Ruangan
            </button>
          )}
          <button onClick={handleLogout} className="flex-1 sm:flex-none bg-red-500 text-white px-6 py-2.5 rounded-lg hover:bg-red-600 transition shadow-sm font-medium">
            Keluar
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-1">
            <div className="relative w-full sm:w-64">
              <input 
                type="text" placeholder="Cari nama, ruangan..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <select 
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Semua Status</option>
              <option value="0">Pending</option>
              <option value="1">Approved</option>
              <option value="2">Rejected</option>
            </select>
          </div>
          {role === 'User' && (
            <button onClick={() => navigate('/user/rooms')} className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium transition shadow-sm">
              + Ajukan Baru
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-gray-50 text-gray-600 uppercase text-xs font-bold tracking-wider">
                <th className="py-4 px-6">Peminjam</th>
                <th className="py-4 px-6">Ruangan</th>
                <th className="py-4 px-6 text-center">Waktu</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-2 text-center">Aksi</th> 
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-medium">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8">Sedang memuat data...</td></tr>
              ) : filteredReservations.length === 0 ? ( 
                <tr><td colSpan={5} className="text-center py-8 text-gray-400">Data tidak ditemukan.</td></tr>
              ) : (
                filteredReservations.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50 transition duration-150">
                    <td className="py-4 px-6 text-gray-900">{item.borrowerName}</td>
                    <td className="py-4 px-6 text-blue-600">{item.room?.name}</td>
                    
                    <td className="py-4 px-6 text-center">
                      <div className="flex flex-col">
                        <span>{new Date(item.startTime).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-400">{new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 text-center">{getStatusLabel(item.status)}</td>
                    
                    <td className="py-4 px-2 text-center whitespace-nowrap">
                      <div className="flex justify-center items-center gap-2">
                        
                        <button onClick={() => handleOpenDetail(item)}
                          className="text-blue-600 hover:text-blue-800 font-bold text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition">
                          Detail
                        </button>

                        {role === 'User' && item.status === 0 && (
                          <>
                            <button onClick={() => navigate(`/reservation/edit/${item.id}`)}
                              className="text-yellow-600 hover:text-yellow-800 font-bold text-xs border border-yellow-200 px-3 py-1 rounded hover:bg-yellow-50 transition">
                              Edit
                            </button>
                            <button onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 font-bold text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition">
                              Batal
                            </button>
                          </>
                        )}

                        {role === 'Admin' && (
                            <button onClick={() => handleDelete(item.id)}
                              className="text-red-600 hover:text-red-800 font-bold text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                              title="Hapus Data">
                              Hapus
                            </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500 text-center">
          Menampilkan {filteredReservations.length} dari total {reservations.length} data.
        </div>
      </div>

      <ReservationModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reservation={selectedReservation}
        onApprove={handleApprove}
        onReject={handleReject}
        loadingAction={actionLoading}
        userRole={role}
      />
    </div>
  );
};

export default Dashboard;