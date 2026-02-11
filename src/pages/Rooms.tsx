import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../services/api';
import type { Room } from '../types';

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Hook untuk pindah halaman

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Gagal ambil data ruangan", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete function
  const handleDelete = async (id: number) => {
    if(confirm("Apakah Anda yakin ingin menghapus ruangan ini secara permanen?")) {
        try {
            await api.delete(`/rooms/${id}`); // Panggil API Delete Backend
            alert("Ruangan berhasil dihapus!");
            fetchRooms(); // Refresh data tanpa reload halaman
        } catch (error) {
            console.error("Gagal menghapus", error);
            alert("Gagal menghapus ruangan.");
        }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium text-sm"
            >
              ← Kembali
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Ruangan</h1>
          </div>

          {/* Add button */}
          <button 
            onClick={() => navigate('/rooms/add')}
            className="w-full sm:w-auto bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-md font-medium"
          >
            + Tambah Ruangan
          </button>
        </div>

        {/* List ruangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500 col-span-3 text-center">Memuat data ruangan...</p>
          ) : rooms.length === 0 ? (
            <p className="text-gray-500 col-span-3 text-center">Belum ada ruangan. Silakan tambah baru.</p>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
                        <p className="text-gray-500 text-sm mt-1">{room.location}</p>
                    </div>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                        {room.capacity} Orang
                    </span>
                </div>
                
                <p className="text-gray-600 mt-4 text-sm line-clamp-2">{room.description}</p>
                
                <div className="flex justify-end items-center pt-4 mt-4 border-t border-gray-100 gap-2">
                  <button 
                        onClick={() => navigate(`/rooms/edit/${room.id}`)}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-sm px-3 py-1 rounded hover:bg-yellow-50 transition"
                    >
                        Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(room.id)}
                    className="text-red-600 hover:text-red-700 font-medium text-sm px-3 py-1 rounded hover:bg-red-50 transition"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Rooms;