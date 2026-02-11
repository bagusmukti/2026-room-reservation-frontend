import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AddRoom: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Kirim data ke Backend (POST /api/rooms)
      await api.post('/rooms', {
        name,
        location,
        capacity: parseInt(capacity), // Pastikan dikirim sebagai angka
        description
      });

      alert("Ruangan berhasil ditambahkan!");
      navigate('/rooms'); // Kembali ke daftar ruangan

    } catch (error) {
      console.error("Gagal menambah ruangan", error);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Tambah Ruangan Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
            <input 
              type="text" required 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Lab Komputer 1"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input 
              type="text" required 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: Gedung D4 Lt. 2"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas (Orang)</label>
            <input 
              type="number" required min="1"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Contoh: 40"
              value={capacity} onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              required rows={3}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Deskripsi fasilitas ruangan..."
              value={description} onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={() => navigate('/rooms')}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {loading ? 'Menyimpan...' : 'Simpan Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;