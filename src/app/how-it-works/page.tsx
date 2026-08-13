import React from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar'; 

export default function HowItWorksPage() {
  const steps = [
    {
      number: "01",
      title: "Upload Leaf Photo",
      description: "Upload a photo of the affected plant leaf showing discoloration, spots, or visible pests. Upload or drag & drop the image into the scanner.",
      icon: (
        <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "Select Vision Intelligence",
      description: "Choose your preferred diagnosis provider: Google Gemini 3.6 Flash for general vision analysis, Plant.id for commercial pathology, or Hugging Face open-source models.",
      icon: (
        <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Automated Feature Parsing",
      description: "The selected model evaluates cellular patterns, fungal growth, or pest signatures against agricultural dataset records.",
      icon: (
        <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Review Treatment & Export",
      description: "Receive a structured diagnostic breakdown with severity ratings, immediate isolation steps, organic and chemical remedies, and downloadable PDF reports for field reference.",
      icon: (
        <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      
      {/* 1. The Sidebar Shell */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-5 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">How it works</h2>
            <p className="text-sm text-gray-500 mt-1">Understand the AI detection pipeline</p>
          </div>
          
          <Link
            href="/"
            className="group flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium text-sm rounded-lg hover:bg-gray-50 hover:text-[#2563EB] hover:border-blue-200 transition-all shadow-sm"
          >
            <svg 
              className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB] group-hover:-translate-x-1 transition-all duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Scanner
          </Link>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                The Analysis Process
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {steps.map((step, idx) => (
                  <div 
                    key={idx}
                    className="group border border-gray-100 rounded-xl p-6 hover:border-blue-100 hover:shadow-md transition-all duration-300 bg-gray-50/50 hover:bg-white"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg flex items-center justify-center group-hover:border-blue-100 group-hover:bg-blue-50 transition-colors duration-200 shadow-sm">
                        {step.icon}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-gray-400 group-hover:text-[#2563EB] transition-colors duration-200">
                          Step {step.number}
                        </span>
                        <h4 className="text-base font-bold text-gray-900 group-hover:text-[#2563EB] transition-colors duration-200">
                          {step.title}
                        </h4>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Box */}
            <div className="bg-[#2563EB] rounded-2xl p-8 text-center shadow-md relative overflow-hidden">
              <div className="relative z-10 space-y-4">
                <h3 className="text-xl font-bold text-white">Ready to inspect a crop?</h3>
                <p className="text-blue-100 text-sm max-w-lg mx-auto">
                  Our system is standing by to process your leaf images and provide immediate diagnostic feedback.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#2563EB] font-bold text-sm rounded-lg hover:bg-gray-50 hover:scale-105 transition-transform duration-200 shadow-sm mt-4"
                >
                  Launch Dashboard
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
              
              {/* Decorative Background Elements */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white opacity-5 rounded-full blur-2xl"></div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}