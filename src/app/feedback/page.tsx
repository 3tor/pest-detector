'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/layout/sidebar';

export default function FeedbackPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] font-sans">
      
      {/* 1. The Sidebar Shell */}
      <Sidebar />

      {/* 2. The Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <header className="bg-white border-b border-gray-100 py-5 px-8 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Feedback</h2>
            <p className="text-sm text-gray-500 mt-1">Help us improve the detection engine</p>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-5xl mx-auto">
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Feedback Form */}
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Send us a message</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Report bugs, request new features, or let us know how the AI is performing in the field.
                </p>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center animate-in fade-in duration-300">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-base font-bold text-gray-900">Thank you for your feedback!</h4>
                    <p className="text-sm text-gray-600 mt-1">Your message has been successfully sent to our team.</p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-4 text-[#2563EB] text-sm font-medium hover:underline"
                    >
                      Send another message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="topic" className="block text-sm font-medium text-gray-700 mb-1.5">What is this regarding?</label>
                      <select 
                        id="topic" 
                        required
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent block p-3 outline-none transition-all"
                      >
                        <option value="">Select a topic...</option>
                        <option value="bug">Report an inaccurate diagnosis</option>
                        <option value="feature">Request a new feature</option>
                        <option value="ui">User interface issue</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">Your Feedback</label>
                      <textarea 
                        id="message" 
                        rows={5}
                        required
                        placeholder="Tell us what's on your mind..."
                        className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-transparent block p-3 outline-none transition-all resize-none"
                      ></textarea>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors shadow-sm disabled:opacity-50 w-full sm:w-auto"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Submit Feedback'
                      )}
                    </button>
                  </form>
                )}
              </div>

              {/* Right Column: Contact Info */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
                  <div className="w-10 h-10 bg-blue-50 text-[#2563EB] rounded-lg flex items-center justify-center mb-4">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2">Further Enquiries</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                    Need help with API integrations, enterprise usage, or discussing the machine learning models? Reach out directly to our engineering team.
                  </p>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <span className="block text-xs font-semibold text-gray-400 tracking-wider uppercase mb-1">Email Us</span>
                    <a 
                      href="mailto:sekudolo@st.ug.edu.gh" 
                      className="text-[#2563EB] font-medium text-sm hover:underline flex items-center gap-1.5"
                    >
                      sekudolo@st.ug.edu.gh
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white shadow-sm relative overflow-hidden">
                  <div className="relative z-10">
                    <h3 className="text-base font-bold mb-2 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Response Times
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      We review all feedback weekly. For critical diagnostic errors, our team aims to respond within 24-48 hours.
                    </p>
                  </div>
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}