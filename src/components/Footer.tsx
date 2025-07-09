import React from 'react';
import { FileText, Twitter, Linkedin, Github, Mail, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'API', href: '#api' },
      { name: 'Integrations', href: '#integrations' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Status', href: '#status' },
      { name: 'Documentation', href: '#docs' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' }
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
      { name: 'Security', href: '#security' }
    ]
  };

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/techy.aravind', label: 'Twitter' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/aravind-pulluri-101291334/', label: 'LinkedIn' },
    { icon: Github, href: 'github.com/aravindpulluri116', label: 'GitHub' },
    { icon: Mail, href: 'https://mail.google.com/mail/?view=cm&to=pulluriaravind@gmail.com', label: 'Email' }
  ];

  return (
    <footer className="bg-slate-800 border-t border-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-slate-100">ATS Checker</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6">
              Optimize your resume for Applicant Tracking Systems and increase your chances of landing interviews with our AI-powered analysis tool.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-slate-700 border border-slate-600 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:border-blue-500 transition-all duration-200"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-slate-100 font-heading font-semibold mb-4 capitalize">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-slate-400 hover:text-slate-200 transition-colors duration-200"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-600 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm">
              © {currentYear} ATS Checker. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm text-slate-400">
              <a href="#privacy" className="hover:text-slate-200 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms" className="hover:text-slate-200 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#cookies" className="hover:text-slate-200 transition-colors duration-200">
                Cookie Settings
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;