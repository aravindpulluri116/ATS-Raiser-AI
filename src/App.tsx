import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import UploadSection from './components/UploadSection';
import ScoreDisplay from './components/ScoreDisplay';
import { ATSAnalysisResult } from './services/geminiService';
import Footer from './components/Footer';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'upload' | 'results'>('landing');
  const [analysisResults, setAnalysisResults] = useState<ATSAnalysisResult | null>(null);

  const handleGetStarted = () => {
    setCurrentView('upload');
  };

  const handleAnalysisComplete = (results: ATSAnalysisResult) => {
    setAnalysisResults(results);
    setCurrentView('results');
  };

  const handleNewAnalysis = () => {
    setAnalysisResults(null);
    setCurrentView('upload');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={null}
        onSignOut={() => {}}
        onNavigate={setCurrentView}
      />
      
      {currentView === 'landing' && <Hero onGetStarted={handleGetStarted} />}
      {currentView === 'upload' && (
        <div className="pt-16 pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-100 mb-4">
                Upload Your Resume
              </h1>
              <p className="text-xl text-slate-300">
                Get instant ATS analysis and optimization suggestions
              </p>
            </div>
            <UploadSection onAnalysisComplete={handleAnalysisComplete} />
          </div>
        </div>
      )}
      {currentView === 'results' && analysisResults && (
        <div className="pt-16 pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-100 mb-4">
                Analysis Results
              </h1>
              <button
                onClick={handleNewAnalysis}
                className="button-secondary"
              >
                Analyze Another Resume
              </button>
            </div>
            <ScoreDisplay results={analysisResults} />
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
}

export default App;