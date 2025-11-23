import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import Navbar from './Navbar';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface DiffResult {
  additions: number;
  deletions: number;
  changes: string[];
}

const CodeEditor: React.FC = () => {
  const navigate = useNavigate();
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState<string>('// Write your code here...');
  const [originalCode, setOriginalCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [theme, setTheme] = useState<string>('vs-dark');
  const [showDiff, setShowDiff] = useState<boolean>(false);
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [lintErrors, setLintErrors] = useState<string[]>([]);
  const [isFormatting, setIsFormatting] = useState<boolean>(false);
  const [isLinting, setIsLinting] = useState<boolean>(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'json', label: 'JSON' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'sql', label: 'SQL' },
  ];

  const themes = [
    { value: 'vs-dark', label: 'Dark' },
    { value: 'light', label: 'Light' },
    { value: 'hc-black', label: 'High Contrast' },
  ];

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    setLintErrors([]);
  };

  const handleFormatCode = async () => {
    if (!code.trim()) return;

    setIsFormatting(true);
    try {
      const response = await axios.post(`${API_URL}/api/code/format`, {
        code,
        language,
      });

      setCode(response.data.formattedCode);
    } catch (error) {
      console.error('Error formatting code:', error);
      alert('Failed to format code. Please try again.');
    } finally {
      setIsFormatting(false);
    }
  };

  const handleLintCode = async () => {
    if (!code.trim()) return;

    setIsLinting(true);
    try {
      const response = await axios.post(`${API_URL}/api/code/lint`, {
        code,
        language,
      });

      setLintErrors(response.data.errors || []);
    } catch (error) {
      console.error('Error linting code:', error);
      alert('Failed to lint code. Please try again.');
    } finally {
      setIsLinting(false);
    }
  };

  const handleDiffCheck = async () => {
    if (!originalCode.trim()) {
      alert('Please set the original code first by clicking "Save as Original"');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/code/diff`, {
        originalCode,
        modifiedCode: code,
      });

      setDiffResult(response.data);
      setShowDiff(true);
    } catch (error) {
      console.error('Error checking diff:', error);
      alert('Failed to check differences. Please try again.');
    }
  };

  const handleSaveAsOriginal = () => {
    setOriginalCode(code);
    alert('Current code saved as original for comparison');
  };

  const handleClearEditor = () => {
    if (confirm('Are you sure you want to clear the editor?')) {
      setCode('// Write your code here...');
      setLintErrors([]);
      setDiffResult(null);
      setShowDiff(false);
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
        <div className="container px-4 mx-auto">
          {/* Header */}
          <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
            <h1 className="mb-2 text-3xl font-bold text-primary-600">Code Editor</h1>
            <p className="text-gray-600">
              Write, format, and analyze your code with advanced features
            </p>
          </div>

          {/* Toolbar */}
          <div className="p-4 mb-4 bg-white rounded-lg shadow-md">
            <div className="flex flex-wrap items-center gap-4">
              {/* Language Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Language:</label>
                <select
                  value={language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {languages.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Theme Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Theme:</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  {themes.map((themeOption) => (
                    <option key={themeOption.value} value={themeOption.value}>
                      {themeOption.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-6 border-l border-gray-300"></div>

              {/* Action Buttons */}
              <button
                onClick={handleFormatCode}
                disabled={isFormatting}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors rounded-lg bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
              >
                {isFormatting ? '⏳ Formatting...' : '✨ Format Code'}
              </button>

              <button
                onClick={handleLintCode}
                disabled={isLinting}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isLinting ? '⏳ Linting...' : '🔍 Lint Code'}
              </button>

              <button
                onClick={handleSaveAsOriginal}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
              >
                📌 Save as Original
              </button>

              <button
                onClick={handleDiffCheck}
                disabled={!originalCode}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-purple-600 rounded-lg hover:bg-purple-700 disabled:bg-gray-400"
              >
                🔄 Check Diff
              </button>

              <button
                onClick={handleClearEditor}
                className="px-4 py-2 text-sm font-semibold text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700"
              >
                🗑️ Clear
              </button>
            </div>
          </div>

          {/* Editor and Panels Container */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Editor */}
            <div className="lg:col-span-2">
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <p className="text-sm font-medium text-gray-700">
                    Editor - {languages.find((l) => l.value === language)?.label}
                  </p>
                </div>
                <Editor
                  height="600px"
                  language={language}
                  value={code}
                  theme={theme}
                  onChange={(value) => setCode(value || '')}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: true },
                    fontSize: 14,
                    lineNumbers: 'on',
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: 'on',
                  }}
                />
              </div>
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
              {/* Lint Errors Panel */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-800">
                    🔍 Lint Results
                  </h3>
                </div>
                <div className="p-4">
                  {lintErrors.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No lint errors. Click "Lint Code" to check.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {lintErrors.map((error, index) => (
                        <div
                          key={index}
                          className="p-2 text-xs text-red-800 bg-red-100 border border-red-300 rounded-lg"
                        >
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Diff Results Panel */}
              {showDiff && diffResult && (
                <div className="bg-white rounded-lg shadow-md">
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800">
                        🔄 Diff Results
                      </h3>
                      <button
                        onClick={() => setShowDiff(false)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="mb-3 space-y-2">
                      <div className="flex items-center justify-between p-2 rounded-lg bg-green-50">
                        <span className="text-xs font-medium text-green-800">
                          Additions
                        </span>
                        <span className="text-sm font-bold text-green-600">
                          +{diffResult.additions}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg bg-red-50">
                        <span className="text-xs font-medium text-red-800">
                          Deletions
                        </span>
                        <span className="text-sm font-bold text-red-600">
                          -{diffResult.deletions}
                        </span>
                      </div>
                    </div>
                    {diffResult.changes.length > 0 && (
                      <div className="mt-3">
                        <p className="mb-2 text-xs font-semibold text-gray-700">
                          Changes:
                        </p>
                        <div className="space-y-1 overflow-y-auto max-h-60">
                          {diffResult.changes.map((change, index) => (
                            <div
                              key={index}
                              className="p-2 font-mono text-xs bg-gray-100 rounded"
                            >
                              {change}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Info Panel */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-800">ℹ️ Tips</h3>
                </div>
                <div className="p-4">
                  <ul className="space-y-2 text-xs text-gray-600">
                    <li>• Use <strong>Format Code</strong> to auto-format your code</li>
                    <li>• Use <strong>Lint Code</strong> to check for errors</li>
                    <li>• Click <strong>Save as Original</strong> before making changes</li>
                    <li>• Use <strong>Check Diff</strong> to see what changed</li>
                    <li>• Press <strong>Ctrl/Cmd + F</strong> to search in editor</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
