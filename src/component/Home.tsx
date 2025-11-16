import React from 'react';
import { logoutUser } from '../service/authService';
import './Home.css';

const Home: React.FC = () => {
  const handleLogout = () => {
    logoutUser();
    window.location.href = '/signin';
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1 className="home-title">SkillMint</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </header>

      <main className="home-main">
        <div className="welcome-section">
          <h2 className="welcome-title">Welcome to SkillMint! 🎉</h2>
          <p className="welcome-text">
            You have successfully logged in to your account.
          </p>
        </div>

        <div className="content-grid">
          <div className="content-card">
            <div className="card-icon">📚</div>
            <h3>Learn Skills</h3>
            <p>Access a wide range of courses and tutorials to enhance your skills.</p>
          </div>

          <div className="content-card">
            <div className="card-icon">🎯</div>
            <h3>Track Progress</h3>
            <p>Monitor your learning journey and achieve your goals.</p>
          </div>

          <div className="content-card">
            <div className="card-icon">🏆</div>
            <h3>Earn Certificates</h3>
            <p>Complete courses and earn certificates to showcase your achievements.</p>
          </div>

          <div className="content-card">
            <div className="card-icon">👥</div>
            <h3>Join Community</h3>
            <p>Connect with learners worldwide and grow together.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
