import React from 'react';

const ResumeBuilder: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-200 navbar">
        <div className="flex items-center justify-between px-5 py-4 mx-auto max-w-7xl">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="SkillMint Logo" className="h-10" style={{ width: 'auto' }} />
          </div>
          <button 
            onClick={() => window.location.href = '/home'}
            className="btn btn-secondary"
          >
            ← Back to Home
          </button>
        </div>
      </header>

      <div className="flex-1 w-full">
        <iframe
          src="https://magical-narwhal-27d593.netlify.app/"
          title="Resume Builder"
          className="w-full h-full border-0"
          style={{ minHeight: 'calc(100vh - 80px)' }}
          allow="clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-downloads allow-modals allow-popups"
        />
      </div>
    </div>
  );
};

export default ResumeBuilder;
