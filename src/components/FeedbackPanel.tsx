import React from 'react';
import { CheckCircle, AlertTriangle, Lightbulb, Download, Share2, TrendingUp } from 'lucide-react';

interface FeedbackPanelProps {
  results: any;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ results }) => {
  const handleExportReport = () => {
    // Mock export functionality
    const reportData = {
      fileName: results.fileName,
      analysisDate: new Date(results.analysisDate).toLocaleDateString(),
      overallScore: results.overallScore,
      suggestions: results.suggestions
    };
    
    console.log('Exporting report:', reportData);
    // In a real app, this would generate and download a PDF
  };

  const handleShareResults = () => {
    // Mock share functionality
    if (navigator.share) {
      navigator.share({
        title: 'My ATS Resume Score',
        text: `I scored ${results.overallScore}% on my ATS resume analysis!`,
        url: window.location.href
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(`I scored ${results.overallScore}% on my ATS resume analysis! Check out ATS Checker to optimize your resume.`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleExportReport}
          className="button-primary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Export PDF Report</span>
        </button>
        <button
          onClick={handleShareResults}
          className="button-secondary flex items-center space-x-2"
        >
          <Share2 className="h-4 w-4" />
          <span>Share Results</span>
        </button>
      </div>

      {/* Improvement Suggestions */}
      <div className="card">
        <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6 flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-yellow-400" />
          <span>Improvement Suggestions</span>
        </h3>
        
        <div className="space-y-4">
          {results.suggestions.map((suggestion: string, index: number) => (
            <div key={index} className="flex items-start space-x-3 p-4 bg-slate-700 bg-opacity-50 rounded-lg">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">{index + 1}</span>
              </div>
              <div className="flex-1">
                <p className="text-slate-200 leading-relaxed">{suggestion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Tips */}
      <div className="card">
        <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6 flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <span>Quick Optimization Tips</span>
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Use Standard Headings</h4>
                <p className="text-slate-400 text-sm">Use conventional section headers like "Experience", "Skills", "Education"</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Include Contact Info</h4>
                <p className="text-slate-400 text-sm">Ensure your phone, email, and location are clearly visible</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Use Action Verbs</h4>
                <p className="text-slate-400 text-sm">Start bullet points with strong action verbs like "Developed", "Managed", "Led"</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Avoid Complex Formatting</h4>
                <p className="text-slate-400 text-sm">Skip tables, text boxes, headers/footers that ATS can't read</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Include Relevant Keywords</h4>
                <p className="text-slate-400 text-sm">Mirror the language and terms used in the job description</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-slate-100 mb-1">Save as Standard Format</h4>
                <p className="text-slate-400 text-sm">Use .pdf or .docx formats for best ATS compatibility</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Score Breakdown Summary */}
      <div className="card">
        <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6">
          Analysis Summary
        </h3>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(results.sections).map(([key, section]: [string, any]) => (
            <div key={key} className="text-center p-4 bg-slate-700 bg-opacity-50 rounded-lg">
              <div className={`text-2xl font-bold mb-1 ${
                section.score >= 80 ? 'text-green-400' : 
                section.score >= 60 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {section.score}%
              </div>
              <div className="text-slate-400 text-sm capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-500 bg-opacity-10 rounded-lg border border-blue-500">
          <p className="text-slate-300 text-center">
            <strong className="text-slate-100">Analysis completed on:</strong>{' '}
            {new Date(results.analysisDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPanel;