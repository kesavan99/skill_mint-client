import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const TEMPLATES = [
  { id: 'resume-template', name: 'Classic Professional', description: 'Traditional format with clean layout', recommended: true },
  { id: 'resume-template-minimalist', name: 'Minimalist Modern', description: 'Clean design with whitespace focus' },
  { id: 'resume-template-two-column', name: 'Two-Column Accent', description: 'Sidebar layout with blue accent' },
  { id: 'resume-template-executive', name: 'Executive Traditional', description: 'Conservative style for senior roles' },
  { id: 'resume-template-skills-first', name: 'Skills-First Hybrid', description: 'Emphasizes technical competencies' },
  { id: 'resume-template-creative', name: 'Creative Infographic', description: 'Visual elements with gradient design' }
];

const ResumePreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const previewRef = useRef<HTMLDivElement>(null);

  // Get resume data from location state or localStorage
  const getResumeData = () => {
    if (location.state?.resumeData) {
      // Save to localStorage for persistence
      localStorage.setItem('resumeData', JSON.stringify(location.state.resumeData));
      return location.state.resumeData;
    }
    const stored = localStorage.getItem('resumeData');
    return stored ? JSON.parse(stored) : null;
  };

  const getSelectedTemplate = () => {
    if (location.state?.selectedTemplate) {
      localStorage.setItem('selectedTemplate', location.state.selectedTemplate);
      return location.state.selectedTemplate;
    }
    return localStorage.getItem('selectedTemplate') || 'resume-template';
  };

  const [resumeData] = useState(getResumeData());
  const [selectedTemplate, setSelectedTemplate] = useState<string>(getSelectedTemplate());

  const generatePreview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/resume/preview`, 
        { ...resumeData, template: selectedTemplate }, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      setPreviewHTML(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert('Failed to generate preview: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resumeData) {
      navigate('/');
      return;
    }

    // Generate preview on mount or when template changes
    generatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTemplate]);

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    localStorage.setItem('selectedTemplate', templateId);
  };

  const handleBackToEditor = () => {
    // Keep data in localStorage for editing
    navigate('/resume-builder');
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current) return;

    setLoading(true);
    try {
      const element = previewRef.current;
      
      const opt = {
        margin: 0,
        filename: `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm' as const, 
          format: 'a4' as const, 
          orientation: 'portrait' as const
        }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!resumeData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with Actions */}
      <div className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToEditor}
                className="flex items-center gap-2 font-semibold text-gray-600 hover:text-gray-800"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Editor
              </button>
              <h1 className="text-xl font-bold text-gray-800">Resume Preview</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8 mx-auto">
        {/* Template Selection */}
        <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800">Choose Resume Template</h2>
            <p className="text-sm text-gray-600">Select a professional template that matches your style</p>
          </div>
          
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                onClick={() => handleTemplateChange(template.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  selectedTemplate === template.id
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-gray-800">{template.name}</h3>
                    {template.recommended && (
                      <span className="mt-1 text-xs font-semibold text-green-600">✨ Recommended</span>
                    )}
                  </div>
                  {selectedTemplate === template.id && (
                    <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Preview Content */}
        <div className="py-8">
          <div className="flex justify-center">
            {loading && !previewHTML ? (
              <div className="p-12 text-center bg-white rounded-lg shadow-lg">
                <div className="w-16 h-16 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary-600"></div>
                <p className="text-lg text-gray-600">Generating preview...</p>
              </div>
            ) : (
              <div ref={previewRef} className="shadow-2xl" style={{ maxWidth: 'fit-content' }}>
                <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 bg-white border-t">
        <div className="container px-4 py-6 mx-auto">
          <div className="flex items-center justify-between">
            <button
              onClick={handleDownloadPDF}
              disabled={loading}
              className="px-8 py-3 text-lg font-semibold text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {loading ? 'Generating...' : '📥 Download PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;
