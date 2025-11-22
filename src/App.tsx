import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './component/Login';
import Home from './component/Home';
import ResumeBuilder from './component/ResumeBuilder';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/resume-builder" element={<ResumeBuilder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
