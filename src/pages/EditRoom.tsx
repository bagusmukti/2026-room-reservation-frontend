import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; // useParams untuk ambil ID dari URL
import api from '../services/api';

const EditRoom: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // Ambil ID dari alamat browser
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // State Form
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [capacity, setCapacity] = useState('');
  const [description, setDescription] = useState('');

  // Ambil Data Lama saat halaman dibuka
  useEffect(() => {
    fetchRoomDetail();
  }, []);

  const fetchRoomDetail = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      const data = response.data;
      
      // Masukkan data lama ke state form
      setName(data.name);
      setLocation(data.location);
      setCapacity(data.capacity.toString());
      setDescription(data.description);
    } catch (error) {
      console.error("Gagal ambil data", error);
      alert("Ruangan tidak ditemukan!");
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  // Simpan Perubahan (PUT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await api.put(`/rooms/${id}`, {
        id: parseInt(id!), // ID wajib dikirim ulang
        name,
        location,
        capacity: parseInt(capacity),
        description
      });

      alert("Ruangan berhasil diperbarui!");
      navigate('/rooms');

    } catch (error) {
      console.error("Gagal update", error);
      alert("Gagal memperbarui ruangan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Memuat data ruangan...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Ruangan</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Ruangan</label>
            <input 
              type="text" required 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lokasi</label>
            <input 
              type="text" required 
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={location} onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kapasitas</label>
            <input 
              type="number" required min="1"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={capacity} onChange={(e) => setCapacity(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              required rows={3}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
              disabled={saving}
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition font-medium"
            >
              {saving ? 'Menyimpan...' : 'Update Ruangan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRoom;