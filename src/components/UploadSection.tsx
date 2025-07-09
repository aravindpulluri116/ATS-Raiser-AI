import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Document, Page, pdfjs } from 'react-pdf';
import { Upload, FileText, X, AlertCircle, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { GeminiService, ATSAnalysisResult } from '../services/geminiService';

// Disable PDF.js worker to avoid version conflicts
pdfjs.GlobalWorkerOptions.workerSrc = '';

interface UploadSectionProps {
  onAnalysisComplete: (results: ATSAnalysisResult) => void;
}

const UploadSection: React.FC<UploadSectionProps> = ({ onAnalysisComplete }) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      setError(null);
      setPreviewError(null);
      setShowPreview(false);
      setCurrentPage(1);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Simulate upload progress with detailed steps
      const progressSteps = [
        { progress: 10, message: 'Processing PDF file...' },
        { progress: 30, message: 'Extracting text content...' },
        { progress: 50, message: 'Analyzing with AI...' },
        { progress: 80, message: 'Generating ATS score...' },
        { progress: 90, message: 'Finalizing analysis...' }
      ];

      let currentStep = 0;
      const progressInterval = setInterval(() => {
        if (currentStep < progressSteps.length) {
          const step = progressSteps[currentStep];
          setUploadProgress(step.progress);
          setProgressMessage(step.message);
          currentStep++;
        } else {
          clearInterval(progressInterval);
        }
      }, 800);

      // Call Gemini service for analysis
      const results = await GeminiService.analyzeResume(uploadedFile, jobDescription || undefined);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setIsAnalyzing(false);
      onAnalysisComplete(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze resume');
      setIsAnalyzing(false);
      setUploadProgress(0);
      setProgressMessage('');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadProgress(0);
    setProgressMessage('');
    setError(null);
    setPreviewError(null);
    setShowPreview(false);
    setCurrentPage(1);
    setNumPages(null);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPreviewError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error('PDF preview error:', error);
    setPreviewError('Unable to preview PDF. You can still analyze the resume.');
  };

  const changePage = (offset: number) => {
    setCurrentPage(prevPage => Math.min(Math.max(1, prevPage + offset), numPages || 1));
  };

  return (
    <div className="space-y-8">
      {/* File Upload Section */}
      <div className="card">
        <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6">
          Upload Your Resume
        </h3>
        
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-custom p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-blue-500 bg-blue-500 bg-opacity-10'
                : 'border-slate-600 hover:border-blue-500 hover:bg-blue-500 hover:bg-opacity-5'
            }`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium text-slate-100 mb-2">
                  {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
                </p>
                <p className="text-slate-400 mb-4">
                  or click to browse files
                </p>
                <p className="text-sm text-slate-500">
                  Supports PDF, DOCX, TXT • Max 10MB
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* File Info */}
            <div className="border border-slate-600 rounded-custom p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100">{uploadedFile.name}</h4>
                    <p className="text-sm text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    disabled={isAnalyzing}
                  >
                    {showPreview ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={removeFile}
                    className="text-slate-400 hover:text-red-400 transition-colors duration-200"
                    disabled={isAnalyzing}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>{progressMessage}</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
              
              {uploadProgress === 100 && !isAnalyzing && (
                <div className="mt-4 flex items-center space-x-2 text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Analysis complete</span>
                </div>
              )}
            </div>

            {/* PDF Preview */}
            {showPreview && (
              <div className="border border-slate-600 rounded-custom p-6 bg-slate-800">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-slate-100">PDF Preview</h4>
                  {numPages && (
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => changePage(-1)}
                        disabled={currentPage <= 1}
                        className="text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      <span className="text-slate-400">
                        Page {currentPage} of {numPages}
                      </span>
                      <button
                        onClick={() => changePage(1)}
                        disabled={currentPage >= numPages}
                        className="text-slate-400 hover:text-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
                <div className="flex justify-center">
                  {previewError ? (
                    <div className="text-center p-8">
                      <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                      <p className="text-slate-300">{previewError}</p>
                    </div>
                  ) : (
                    <Document
                      file={uploadedFile}
                      onLoadSuccess={onDocumentLoadSuccess}
                      onLoadError={onDocumentLoadError}
                      className="max-w-full"
                    >
                      <Page
                        pageNumber={currentPage}
                        width={Math.min(600, window.innerWidth - 100)}
                        className="shadow-lg"
                      />
                    </Document>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {fileRejections.length > 0 && (
          <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-600 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Upload Error</span>
            </div>
            <p className="text-sm text-red-300 mt-1">
              {fileRejections[0].errors[0].message}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-900 bg-opacity-20 border border-red-600 rounded-lg">
            <div className="flex items-center space-x-2 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Analysis Error</span>
            </div>
            <p className="text-sm text-red-300 mt-1">{error}</p>
          </div>
        )}
      </div>

      {/* Job Description Section */}
      <div className="card">
        <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6">
          Job Description (Optional)
        </h3>
        <p className="text-slate-400 mb-4">
          Paste the job description to get more targeted keyword analysis and suggestions.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the job description here..."
          className="input-field w-full h-32 resize-none"
        />
      </div>

      {/* Analyze Button */}
      <div className="text-center">
        <button
          onClick={handleAnalyze}
          disabled={!uploadedFile || isAnalyzing}
          className="button-primary text-lg px-8 py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          {isAnalyzing ? (
            <div className="flex items-center space-x-2">
              <Loader className="h-5 w-5 animate-spin" />
              <span>Analyzing Resume...</span>
            </div>
          ) : (
            'Analyze Resume'
          )}
        </button>
      </div>
    </div>
  );
};

export default UploadSection;