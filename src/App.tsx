import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard'; 
import Rooms from './pages/Rooms';
import AddRoom from './pages/AddRoom';


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
      </Routes>
    </Router>
  );
}

export default App;