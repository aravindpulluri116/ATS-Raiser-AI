import React from 'react';
import { ArrowRight, CheckCircle, Upload, BarChart, Target, Award } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  const features = [
    'AI-powered ATS analysis',
    'Instant compatibility scoring',
    'Detailed improvement suggestions',
    'Job description matching'
  ];

  const stats = [
    { icon: Upload, label: 'Resumes Analyzed', value: '50K+' },
    { icon: Award, label: 'Success Rate', value: '94%' },
    { icon: Target, label: 'Accuracy Rate', value: '98%' },
    { icon: BarChart, label: 'Avg Score Improvement', value: '+40%' }
  ];

  return (
    <div className="relative pt-16 pb-20 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 opacity-10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-cyan-500 opacity-10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Content */}
        <div className="text-center space-y-8 py-20">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-slate-100 leading-tight">
              Beat the{' '}
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                ATS System
              </span>
            </h1>
            <p className="mt-6 text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Get your resume noticed by employers with our AI-powered ATS compatibility checker. 
              Optimize your resume and increase your chances of landing interviews.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={onGetStarted}
              className="button-primary flex items-center space-x-2 text-lg px-8 py-4"
            >
              <span>Start Free Analysis</span>
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-6 text-sm text-slate-400 animate-fade-in">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-4 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto animate-float">
                <stat.icon className="h-8 w-8 text-white" />
              </div>
              <div>
                <div className="text-3xl font-heading font-bold text-slate-100">{stat.value}</div>
                <div className="text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Features Section */}
        <div id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-slate-100 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Our comprehensive suite of tools helps you create ATS-friendly resumes that get results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: 'Smart Upload',
                description: 'Drag and drop your resume for instant analysis. Supports PDF and DOC formats with intelligent parsing.'
              },
              {
                icon: BarChart,
                title: 'Detailed Scoring',
                description: 'Get comprehensive scores across multiple criteria including keywords, formatting, and structure.'
              },
              {
                icon: Target,
                title: 'Job Matching',
                description: 'Compare your resume against specific job descriptions to identify missing keywords and skills.'
              },
              {
                icon: CheckCircle,
                title: 'Actionable Feedback',
                description: 'Receive specific suggestions on how to improve your resume for better ATS compatibility.'
              },
              {
                icon: Award,
                title: 'Industry Standards',
                description: 'Our algorithms are based on current ATS systems used by top companies and recruiters.'
              },
              {
                icon: ArrowRight,
                title: 'Export Reports',
                description: 'Download detailed PDF reports with your scores and improvement recommendations.'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="card hover:border-blue-500 group cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-glow transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-heading font-semibold text-slate-100 mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;