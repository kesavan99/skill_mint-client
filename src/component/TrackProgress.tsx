import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface RoadmapStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
  action?: string;
  route?: string;
}

const TrackProgress: React.FC = () => {
  const navigate = useNavigate();
  const [roadmapSteps, setRoadmapSteps] = useState<RoadmapStep[]>([
    {
      id: 1,
      title: 'Account Setup',
      description: 'Create your account and login to SkillMint platform',
      icon: '✅',
      completed: true,
      locked: false,
    },
    {
      id: 2,
      title: 'Learn Fundamentals',
      description: 'Start with programming basics, data structures, and algorithms',
      icon: '📚',
      completed: false,
      locked: false,
      action: 'Start Learning',
    },
    {
      id: 3,
      title: 'Build Resume',
      description: 'Create a professional resume highlighting your skills and projects',
      icon: '📄',
      completed: false,
      locked: false,
      action: 'Create Resume',
      route: '/resume-builder',
    },
    {
      id: 4,
      title: 'Practice Coding',
      description: 'Solve coding problems and improve your programming skills',
      icon: '💻',
      completed: false,
      locked: false,
      action: 'Start Coding',
      route: '/code-editor',
    },
    {
      id: 5,
      title: 'Build Projects',
      description: 'Create real-world projects to showcase in your portfolio',
      icon: '🚀',
      completed: false,
      locked: false,
      action: 'View Projects',
    },
    {
      id: 6,
      title: 'Take Assessments',
      description: 'Test your knowledge with coding assessments and quizzes',
      icon: '📝',
      completed: false,
      locked: false,
      action: 'Start Test',
    },
    {
      id: 7,
      title: 'Mock Interviews',
      description: 'Practice with mock interviews and get feedback',
      icon: '🎤',
      completed: false,
      locked: false,
      action: 'Practice Interview',
    },
    {
      id: 8,
      title: 'Apply for Jobs',
      description: 'Browse and apply for IT jobs matching your skills',
      icon: '💼',
      completed: false,
      locked: false,
      action: 'Browse Jobs',
    },
  ]);

  const completedCount = roadmapSteps.filter(step => step.completed).length;
  const totalSteps = roadmapSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  const handleStepAction = (step: RoadmapStep) => {
    if (step.route) {
      navigate(step.route);
    } else {
      alert(`${step.title} - Coming Soon!`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-20 pb-8">
        <div className="container px-4 mx-auto max-w-5xl">
          {/* Header */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h1 className="mb-2 text-3xl font-bold text-primary-600">Track Your Progress</h1>
            <p className="text-gray-600">
              Follow this roadmap to land your dream IT job
            </p>
          </div>

          {/* Progress Overview */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Overall Progress</h2>
                <p className="text-sm text-gray-600">
                  {completedCount} of {totalSteps} steps completed
                </p>
              </div>
              <div className="text-3xl font-bold text-primary-600">
                {Math.round(progressPercentage)}%
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-700 transition-all duration-500 ease-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Milestones */}
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Job Ready</span>
            </div>
          </div>

          {/* Roadmap Steps */}
          <div className="space-y-4">
            {roadmapSteps.map((step, index) => (
              <div
                key={step.id}
                className={`relative bg-white rounded-lg shadow-md transition-all duration-300 ${
                  step.locked
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-lg'
                }`}
              >
                {/* Connecting Line */}
                {index < roadmapSteps.length - 1 && (
                  <div
                    className={`absolute left-12 top-full w-1 h-4 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  ></div>
                )}

                <div className="flex items-start p-6">
                  {/* Step Icon & Number */}
                  <div className="flex flex-col items-center mr-6">
                    <div
                      className={`flex items-center justify-center w-16 h-16 rounded-full text-3xl ${
                        step.completed
                          ? 'bg-green-100 border-4 border-green-500'
                          : step.locked
                          ? 'bg-gray-100 border-4 border-gray-300'
                          : 'bg-primary-100 border-4 border-primary-500'
                      }`}
                    >
                      {step.completed ? '✓' : step.icon}
                    </div>
                    <span className="mt-2 text-sm font-semibold text-gray-500">
                      Step {step.id}
                    </span>
                  </div>

                  {/* Step Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            step.completed
                              ? 'text-green-700'
                              : step.locked
                              ? 'text-gray-400'
                              : 'text-gray-800'
                          }`}
                        >
                          {step.title}
                          {step.completed && (
                            <span className="ml-3 px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                              Completed
                            </span>
                          )}
                          {step.locked && (
                            <span className="ml-3 px-3 py-1 text-xs font-semibold text-gray-600 bg-gray-200 rounded-full">
                              🔒 Locked
                            </span>
                          )}
                        </h3>
                        <p
                          className={`text-base mb-4 ${
                            step.locked ? 'text-gray-400' : 'text-gray-600'
                          }`}
                        >
                          {step.description}
                        </p>
                        
                        {/* Action Button */}
                        {!step.completed && !step.locked && step.action && (
                          <button
                            onClick={() => handleStepAction(step)}
                            className="px-6 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700"
                          >
                            {step.action} →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Motivational Message */}
          <div className="p-6 mt-6 text-center bg-gradient-to-r from-primary-600 to-primary-800 rounded-lg shadow-md">
            <h3 className="mb-2 text-2xl font-bold text-white">
              {completedCount === totalSteps
                ? '🎉 Congratulations! You are Job Ready!'
                : completedCount === 0
                ? '🚀 Start Your Journey Today!'
                : '💪 Keep Going! You\'re Making Great Progress!'}
            </h3>
            <p className="text-primary-100">
              {completedCount === totalSteps
                ? 'You have completed all steps. Time to apply for your dream job!'
                : `${totalSteps - completedCount} more steps to become job-ready`}
            </p>
          </div>

          {/* Tips Section */}
          <div className="p-6 mt-6 bg-white rounded-lg shadow-md">
            <h3 className="mb-4 text-xl font-bold text-gray-800">💡 Pro Tips</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <span className="mr-3 text-primary-600">✓</span>
                <span className="text-gray-700">
                  Complete each step in order for the best learning experience
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary-600">✓</span>
                <span className="text-gray-700">
                  Practice coding daily to improve your problem-solving skills
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary-600">✓</span>
                <span className="text-gray-700">
                  Build projects that showcase your skills to potential employers
                </span>
              </li>
              <li className="flex items-start">
                <span className="mr-3 text-primary-600">✓</span>
                <span className="text-gray-700">
                  Keep your resume updated with new skills and projects
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackProgress;
