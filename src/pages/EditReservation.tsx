import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import type { Room } from '../types';

const EditReservation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [roomName, setRoomName] = useState('');
  
  // FORM STATE
  const [borrowerName, setBorrowerName] = useState('');
  const [roomId, setRoomId] = useState<number>(0);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [purpose, setPurpose] = useState('');

  useEffect(() => {
    fetchReservation();
  }, []);

  const fetchReservation = async () => {
    try {
      const response = await api.get(`/reservations/${id}`);
      const data = response.data;

      // Validasi: Hanya boleh edit jika Pending
      if (data.status !== 0) {
        alert("Peminjaman yang sudah diproses tidak dapat diedit.");
        navigate('/dashboard');
        return;
      }

      setBorrowerName(data.borrowerName);
      setRoomId(data.roomId);
      setRoomName(data.room?.name || 'Ruangan');
      setPurpose(data.purpose);
      
      // Format tanggal untuk input datetime-local (YYYY-MM-DDTHH:mm)
      setStartTime(new Date(data.startTime).toISOString().slice(0, 16));
      setEndTime(new Date(data.endTime).toISOString().slice(0, 16));
      
      setLoading(false);
    } catch (error) {
      console.error("Gagal load data", error);
      alert("Data tidak ditemukan");
      navigate('/dashboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PUT ke Backend
      await api.put(`/reservations/${id}`, {
        borrowerName,
        roomId,
        startTime,
        endTime,
        purpose
      });

      alert("Perubahan Berhasil Disimpan!");
      navigate('/dashboard');

    } catch (error: any) {
      console.error("Update failed", error);
      // Handle Error Backend (Bentrok dll)
      let pesanError = "Gagal menyimpan perubahan.";
      if (error.response?.data) {
         if (typeof error.response.data === 'string') pesanError = error.response.data;
         else if (error.response.data.message) pesanError = error.response.data.message;
      }
      alert(pesanError);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat data...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        
        <div className="mb-6 border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Edit Peminjaman</h2>
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100 text-yellow-800 text-sm">
                Mengubah data pada ruangan: <strong>{roomName}</strong>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Peminjam</label>
            <input 
              type="text" required
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              value={borrowerName} onChange={(e) => setBorrowerName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mulai</label>
                <input 
                type="datetime-local" required 
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                value={startTime} onChange={(e) => setStartTime(e.target.value)}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Selesai</label>
                <input 
                type="datetime-local" required 
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
                value={endTime} onChange={(e) => setEndTime(e.target.value)}
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keperluan</label>
            <textarea 
              required rows={3}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              value={purpose} onChange={(e) => setPurpose(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={() => navigate('/dashboard')} 
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition">
              Batal
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditReservation;