import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import type { Room } from '../types';

const UserRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk menyimpan nama user yang login
  const [username, setUsername] = useState(''); 
  
  const navigate = useNavigate();

  useEffect(() => {
    // Ambil username dari LocalStorage
    const storedName = localStorage.getItem('username');
    if (storedName) {
        setUsername(storedName);
    }
    
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error("Gagal load ruangan", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
             <button 
              onClick={() => navigate('/dashboard')} 
              className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition font-medium text-sm shadow-sm"
            >
              ← Kembali
            </button>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Halo <span className="text-blue-600">{username}</span>, Mau Pinjam Ruangan?
                </h1>
                <p className="text-gray-500 text-sm mt-1">Berikut daftar ruangan yang tersedia untukmu.</p>
            </div>
          </div>
        </div>

        {/* Grid Ruangan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-3 text-center py-10 text-gray-500">Sedang memuat data ruangan...</p>
          ) : rooms.map((room) => (
            <div key={room.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition flex flex-col justify-between h-full group">
              <div>
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition">{room.name}</h3>
                    <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                        {room.capacity} Orang
                    </span>
                </div>
                <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                   📍 {room.location}
                </p>
                <p className="text-gray-600 text-sm line-clamp-3 mb-4">{room.description}</p>
              </div>
              
              <div className="pt-4 border-t border-gray-100 mt-auto">
                <button 
                  onClick={() => navigate(`/book/${room.id}`)} 
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
                >
                  Ajukan Peminjaman
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserRooms;