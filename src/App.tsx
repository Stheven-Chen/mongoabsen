import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Absen from './pages/absen';
import Admin from './pages/admin';

const App: React.FC = () => {
  const [names, setNames] = useState<string[]>([]);
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setNames={setNames} username={username} setUsername={setUsername} setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/absen" element={isLoggedIn ? <Absen names={names} username={username} /> : <Navigate to="/" />} />
        <Route path="/admin" element={isLoggedIn ? <Admin/> : <Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
