import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';

interface PDFDebuggerProps {
  onClose: () => void;
}

const PDFDebugger: React.FC<PDFDebuggerProps> = ({ onClose }) => {
  const [testFile, setTestFile] = useState<File | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setTestFile(file);
      setDebugInfo('');
    }
  };

  const runDebugTest = async () => {
    if (!testFile) return;

    setIsTesting(true);
    setDebugInfo('Starting debug test...\n');

    try {
      // Test environment
      setDebugInfo(prev => prev + `Environment: ${typeof window !== 'undefined' ? 'Browser' : 'Server'}\n`);
      setDebugInfo(prev => prev + `Production: ${import.meta.env.PROD}\n`);
      setDebugInfo(prev => prev + `API Key: ${import.meta.env.VITE_GEMINI_API_KEY ? 'Present' : 'Missing'}\n\n`);

      // Test file info
      setDebugInfo(prev => prev + `File: ${testFile.name}\n`);
      setDebugInfo(prev => prev + `Size: ${testFile.size} bytes\n`);
      setDebugInfo(prev => prev + `Type: ${testFile.type}\n\n`);

      // Test PDF extraction
      setDebugInfo(prev => prev + 'Testing PDF extraction...\n');
      const text = await GeminiService['extractTextFromFile'](testFile);
      setDebugInfo(prev => prev + `Extracted text length: ${text.length}\n`);
      setDebugInfo(prev => prev + `First 200 chars: ${text.substring(0, 200)}\n\n`);

      // Test analysis
      setDebugInfo(prev => prev + 'Testing full analysis...\n');
      const result = await GeminiService.analyzeResume(testFile);
      setDebugInfo(prev => prev + `Analysis successful: ${result.isFromGemini}\n`);
      setDebugInfo(prev => prev + `Score: ${result.overallScore}\n`);

    } catch (error) {
      setDebugInfo(prev => prev + `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n`);
      if (error instanceof Error) {
        setDebugInfo(prev => prev + `Stack: ${error.stack}\n`);
      }
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-100">PDF Debug Tool</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select PDF file to test:
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500 file:text-white hover:file:bg-blue-600"
            />
          </div>

          {testFile && (
            <button
              onClick={runDebugTest}
              disabled={isTesting}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg disabled:opacity-50"
            >
              {isTesting ? 'Running Test...' : 'Run Debug Test'}
            </button>
          )}

          {debugInfo && (
            <div className="bg-slate-900 rounded-lg p-4">
              <h4 className="text-sm font-medium text-slate-300 mb-2">Debug Output:</h4>
              <pre className="text-xs text-slate-400 whitespace-pre-wrap overflow-x-auto">
                {debugInfo}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDFDebugger; 