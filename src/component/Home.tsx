import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Home: React.FC = () => {
  const navigate = useNavigate();

  // Clear resume data when returning to home
  useEffect(() => {
    localStorage.removeItem('resumeData');
    localStorage.removeItem('selectedTemplate');
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <main className="px-5 py-16 mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-5 text-5xl font-bold text-gray-900">Welcome to SkillMint! 🎉</h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            You have successfully logged in to your account.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mt-10 md:grid-cols-2 lg:grid-cols-3">
          <div className="relative transition-all duration-300 cursor-not-allowed card opacity-60">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
              <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-600 rounded-full">🚧 Under Development</span>
            </div>
            <div className="mb-5 text-5xl text-center">📚</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Learn Skills</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Access a wide range of courses and tutorials to enhance your skills.
            </p>
          </div>

          <div 
            className="transition-all duration-300 cursor-pointer card hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate('/track-progress')}
          >
            <div className="mb-5 text-5xl text-center">🎯</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Track Progress</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Monitor your learning journey and achieve your goals.
            </p>
          </div>

          <div 
            className="transition-all duration-300 cursor-pointer card hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate('/code-editor')}
          >
            <div className="mb-5 text-5xl text-center">💻</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Code Editor</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Practice coding with our interactive HackerRank-style code editor.
            </p>
          </div>

          <div 
            className="transition-all duration-300 cursor-pointer card hover:shadow-lg hover:-translate-y-1"
            onClick={() => navigate('/resume-builder')}
          >
            <div className="mb-5 text-5xl text-center">📄</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Resume Builder</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Create professional resumes with our easy-to-use builder.
            </p>
          </div>

          <div className="relative transition-all duration-300 cursor-not-allowed card opacity-60">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
              <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-600 rounded-full">🚧 Under Development</span>
            </div>
            <div className="mb-5 text-5xl text-center">🏆</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Earn Certificates</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Complete courses and earn certificates to showcase your achievements.
            </p>
          </div>

          <div className="relative transition-all duration-300 cursor-not-allowed card opacity-60">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
              <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-600 rounded-full">🚧 Under Development</span>
            </div>
            <div className="mb-5 text-5xl text-center">👥</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Join Community</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Connect with learners worldwide and grow together.
            </p>
          </div>

          <div className="relative transition-all duration-300 cursor-not-allowed card opacity-60">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 rounded-lg">
              <span className="px-4 py-2 text-sm font-bold text-white bg-yellow-600 rounded-full">🚧 Under Development</span>
            </div>
            <div className="mb-5 text-5xl text-center">💼</div>
            <h3 className="mb-4 text-xl font-semibold text-center text-gray-800">Job Insights</h3>
            <p className="text-base leading-relaxed text-center text-gray-600">
              Discover job vacancies and career opportunities tailored for you.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
