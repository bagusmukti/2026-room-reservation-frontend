import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Room } from '../types';

const CreateReservation: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [borrowerName, setBorrowerName] = useState(''); 
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    // 1. Cek Login
    if (!localStorage.getItem('token')) {
        alert("Silakan login dulu.");
        navigate('/login');
        return;
    }

    // 2. Ambil Info Ruangan
    const fetchRoom = async () => {
        try {
            const res = await api.get(`/rooms/${roomId}`);
            setRoom(res.data);
        } catch (err) {
            alert("Ruangan tidak ditemukan");
            navigate('/dashboard');
        }
    };
    fetchRoom();
  }, [roomId, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/reservations', {
        borrowerName: borrowerName,
        roomId: parseInt(roomId!),
        startTime: startTime,
        endTime: endTime,
        purpose: purpose
      });

      alert("Pengajuan Berhasil! Menunggu persetujuan Admin.");
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Booking failed", error);
      
      let pesanError = "Gagal mengajukan peminjaman.";
      if (error.response && error.response.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          pesanError = data;
        } else if (data.errors) {
          const detailError = Object.values(data.errors).flat().join('\n');
          pesanError = `Data tidak valid:\n${detailError}`;
        } else if (data.title) {
          pesanError = data.title;
        }
      }
      alert(pesanError);
    } finally {
      setLoading(false);
    }
  };

  if (!room) return <p className="text-center mt-10">Memuat info ruangan...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        
        {/* Header Form */}
        <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Form Peminjaman</h2>
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <p className="font-bold text-blue-800 text-lg">{room.name}</p>
                <p className="text-blue-600 text-sm">{room.location} • Kapasitas {room.capacity}</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap Peminjam</label>
            <input 
              type="text" 
              required
              placeholder="Contoh: Budi Santoso (Ketua BEM)"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={borrowerName} 
              onChange={(e) => setBorrowerName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                <input 
                type="datetime-local" required 
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={startTime} onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                <input 
                type="datetime-local" required 
                className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                value={endTime} onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
            <textarea 
              required rows={3}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Rapat Himpunan Mahasiswa..."
              value={purpose} onChange={(e) => setPurpose(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/user/rooms')}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading ? 'Mengirim...' : 'Ajukan Sekarang'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReservation;