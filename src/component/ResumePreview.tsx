import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import html2pdf from 'html2pdf.js';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ResumePreview: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [previewHTML, setPreviewHTML] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const resumeData = location.state?.resumeData;
  const previewRef = useRef<HTMLDivElement>(null);

  const generatePreview = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/resume/preview`, resumeData, {
        headers: { 'Content-Type': 'application/json' }
      });
      setPreviewHTML(response.data);
    } catch (error: any) {
      alert('Failed to generate preview: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!resumeData) {
      navigate('/');
      return;
    }

    // Generate preview on mount
    generatePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } catch (error: any) {
      console.error('PDF generation error:', error);
      alert('Failed to generate PDF: ' + error.message);
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
                onClick={() => navigate('/')}
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

      {/* Preview Content */}
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          {loading && !previewHTML ? (
            <div className="p-12 text-center bg-white rounded-lg shadow-lg">
              <div className="w-16 h-16 mx-auto mb-4 border-b-2 rounded-full animate-spin border-primary-600"></div>
              <p className="text-lg text-gray-600">Generating preview...</p>
            </div>
          ) : (
            <div ref={previewRef} className="overflow-hidden bg-white rounded-lg shadow-lg">
              <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
            </div>
          )}
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
