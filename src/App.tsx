import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Rooms from './pages/Rooms';
import AddRoom from './pages/AddRoom';
import EditRoom from './pages/EditRoom';
import UserRooms from './pages/UserRooms'; 
import CreateReservation from './pages/CreateReservation'; 
import EditReservation from './pages/EditReservation';


function App() {
  return (
    <Router>
      <Routes>
        {/* Route utama langsung ke Login */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/add" element={<AddRoom />} />
        <Route path="/rooms/edit/:id" element={<EditRoom />} />
        <Route path="/user/rooms" element={<UserRooms />} />
        <Route path="/book/:roomId" element={<CreateReservation />} />
        <Route path="/reservation/edit/:id" element={<EditReservation />} />
      </Routes>
    </Router>
  );
}

export default App;