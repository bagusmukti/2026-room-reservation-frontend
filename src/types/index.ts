// Tipe data User (Isi Token JWT)
export interface UserPayload {
  unique_name: string; // Username
  email?: string;
  // Key khusus ASP.NET Identity untuk Role
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string; 
  exp: number;
}

// Tipe data Ruangan
export interface Room {
  id: number;
  name: string;
  location: string;
  capacity: number;
  description: string;
}

// Tipe data Peminjaman (Sesuai API Backend)
export interface Reservation {
  id: number;
  borrowerName: string;
  startTime: string; // Format DateTime ISO
  endTime: string;
  purpose: string;
  status: number; // 0: Pending, 1: Approved, 2: Rejected
  room: Room;
}