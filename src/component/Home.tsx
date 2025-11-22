import React from 'react';
import { logoutUser } from '../service/authService';

const Home: React.FC = () => {
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="navbar">
        <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SkillMint Logo" className="h-10" style={{ width: 'auto' }} />
          </div>
          <button onClick={handleLogout} className="btn btn-primary">
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-5 text-gray-900">Welcome to SkillMint! 🎉</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            You have successfully logged in to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-10">
          <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-5 text-center">📚</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Learn Skills</h3>
            <p className="text-gray-600 text-base leading-relaxed text-center">
              Access a wide range of courses and tutorials to enhance your skills.
            </p>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-5 text-center">🎯</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Track Progress</h3>
            <p className="text-gray-600 text-base leading-relaxed text-center">
              Monitor your learning journey and achieve your goals.
            </p>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-5 text-center">🏆</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Earn Certificates</h3>
            <p className="text-gray-600 text-base leading-relaxed text-center">
              Complete courses and earn certificates to showcase your achievements.
            </p>
          </div>

          <div className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <div className="text-5xl mb-5 text-center">👥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">Join Community</h3>
            <p className="text-gray-600 text-base leading-relaxed text-center">
              Connect with learners worldwide and grow together.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
