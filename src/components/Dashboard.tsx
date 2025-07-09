import React, { useState } from 'react';
import UploadSection from './UploadSection';
import ScoreDisplay from './ScoreDisplay';
import FeedbackPanel from './FeedbackPanel';
import { Upload, FileText, BarChart3, TrendingUp } from 'lucide-react';

interface DashboardProps {
  user: any;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'results' | 'history'>('upload');
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  const handleAnalysisComplete = (results: any) => {
    setAnalysisResults(results);
    setActiveTab('results');
  };

  const tabs = [
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'results', label: 'Analysis Results', icon: BarChart3 },
    { id: 'history', label: 'History', icon: TrendingUp }
  ];

  const mockHistory = [
    { id: 1, filename: 'John_Doe_Resume.pdf', score: 85, date: '2024-01-15', status: 'Excellent' },
    { id: 2, filename: 'Resume_v2.pdf', score: 72, date: '2024-01-10', status: 'Good' },
    { id: 3, filename: 'Senior_Developer_Resume.pdf', score: 91, date: '2024-01-05', status: 'Excellent' }
  ];

  return (
    <div className="pt-20 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-slate-100 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-slate-400">
            Optimize your resume for better ATS compatibility and landing more interviews.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-slate-800 rounded-custom p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 flex-1 justify-center ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-glow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-fade-in">
          {activeTab === 'upload' && (
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          )}
          
          {activeTab === 'results' && (
            <div className="space-y-8">
              {analysisResults ? (
                <>
                  <ScoreDisplay results={analysisResults} />
                  <FeedbackPanel results={analysisResults} />
                </>
              ) : (
                <div className="card text-center py-12">
                  <FileText className="h-16 w-16 text-slate-500 mx-auto mb-4" />
                  <h3 className="text-xl font-heading font-semibold text-slate-100 mb-2">
                    No Analysis Yet
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Upload your resume to see detailed analysis results and improvement suggestions.
                  </p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="button-primary"
                  >
                    Upload Resume
                  </button>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'history' && (
            <div className="card">
              <h3 className="text-xl font-heading font-semibold text-slate-100 mb-6">
                Analysis History
              </h3>
              <div className="space-y-4">
                {mockHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-slate-600 rounded-lg hover:border-blue-500 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-100">{item.filename}</h4>
                        <p className="text-sm text-slate-400">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-slate-100">{item.score}%</div>
                        <div className={`text-sm ${
                          item.score >= 80 ? 'text-green-400' : 
                          item.score >= 60 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {item.status}
                        </div>
                      </div>
                      <button className="button-secondary text-sm px-4 py-2">
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;