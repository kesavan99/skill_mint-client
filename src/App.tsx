import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from './component/Login';
import Home from './component/Home';
import ResumeBuilder from './component/ResumeBuilder';
import ResumePreview from './component/ResumePreview';
import CodeEditor from './component/CodeEditor';
import { initSessionTimeout } from './service/authService';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Auth Route wrapper (redirects to home if already logged in)
const AuthRoute = ({ children }: { children: React.ReactElement }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? <Navigate to="/home" replace /> : children;
};

function App() {
  useEffect(() => {
    // Initialize session timeout monitoring
    initSessionTimeout();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
        <Route path="/preview" element={<ProtectedRoute><ResumePreview /></ProtectedRoute>} />
        <Route path="/code-editor" element={<ProtectedRoute><CodeEditor /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
