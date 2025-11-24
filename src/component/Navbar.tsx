import React from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../service/authService';

const Navbar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    // Clear resume data on logout
    localStorage.removeItem('resumeData');
    localStorage.removeItem('selectedTemplate');
    navigate('/login');
  };

  const handleLogoClick = () => {
    navigate('/home');
  };

  return (
    <header className="bg-white border-b border-gray-200 navbar">
      <div className="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl">
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={handleLogoClick}
        >
          <img 
            src="/logo.png" 
            alt="SkillMint Logo" 
            className="h-10 transition-transform hover:scale-105" 
            style={{ width: 'auto' }} 
          />
        </div>
        <button 
          onClick={handleLogout} 
          className="btn btn-primary"
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
