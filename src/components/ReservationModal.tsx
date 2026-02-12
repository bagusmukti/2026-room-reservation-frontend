import React from 'react';
import type { Reservation } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  reservation: Reservation | null;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  loadingAction: boolean;
  userRole: string; 
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  reservation,
  onApprove,
  onReject,
  loadingAction,
  userRole
}) => {
  if (!isOpen || !reservation) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4 transition-opacity">
      
      {/* Container Modal */}
      <div className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
        
        {/* Header Modal */}
        <div className="flex items-center justify-between border-b pb-4">
          <h3 className="text-xl font-bold text-gray-900">Detail Peminjaman</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        {/* Isi Modal */}
        <div className="mt-4 space-y-4">
          
          {/* Baris 1: Nama Peminjam */}
          <div>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Peminjam</span>
            <span className="text-base font-medium text-gray-900">{reservation.borrowerName}</span>
          </div>
          
          {/* Baris 2: Ruangan & Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Ruangan</span>
              <span className="text-base font-medium text-blue-600">{reservation.room?.name}</span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Status</span>
              <span className={`inline-block px-2 py-1 rounded text-xs font-bold mt-1
                ${reservation.status === 0 ? 'bg-yellow-100 text-yellow-800' : 
                  reservation.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {reservation.status === 0 ? 'Pending' : reservation.status === 1 ? 'Disetujui' : 'Ditolak'}
              </span>
            </div>
          </div>

          {/* Baris 3: Waktu Mulai & Selesai */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Mulai</span>
              <span className="text-sm text-gray-700">
                {new Date(reservation.startTime).toLocaleDateString()} <br/>
                {new Date(reservation.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
            <div>
              <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Selesai</span>
              <span className="text-sm text-gray-700">
                {new Date(reservation.endTime).toLocaleDateString()} <br/>
                {new Date(reservation.endTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>

          {/* Baris 4: Keperluan */}
          <div>
            <span className="block text-xs font-bold text-gray-500 uppercase tracking-wide">Keperluan</span>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg border border-gray-100 text-sm text-gray-700">
              {reservation.purpose}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
          >
            Tutup
          </button>

          {/* Logika Tombol: Hanya muncul jika role Admin dan Status Pending */}
          {userRole === 'Admin' && reservation.status === 0 && (
            <>
              <button
                onClick={() => onReject(reservation.id)}
                disabled={loadingAction}
                className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-200 transition"
              >
                {loadingAction ? '...' : 'Tolak'}
              </button>
              <button
                onClick={() => onApprove(reservation.id)}
                disabled={loadingAction}
                className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition shadow-sm"
              >
                {loadingAction ? '...' : 'Setujui'}
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  );
};

export default ReservationModal;