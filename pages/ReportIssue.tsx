import React, { useState } from 'react';
import { AlertTriangle, Send, Bug, PenTool } from 'lucide-react';
import { Toast } from '../components/Toast';

export const ReportIssue: React.FC = () => {
  const [issueType, setIssueType] = useState('Hardware Defect');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
         <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
         </div>
         <h1 className="text-3xl font-bold text-primary">Report an Issue</h1>
         <p className="text-secondary mt-2">Help us maintain quality by reporting bugs or damaged hardware.</p>
      </div>

      {submitted ? (
        <div className="bg-green-50 border border-green-100 rounded-3xl p-10 text-center animate-in fade-in zoom-in-95">
           <h3 className="text-2xl font-bold text-green-800 mb-2">Report Submitted</h3>
           <p className="text-green-700 mb-6">Thank you for your feedback. Our team will review the issue shortly.</p>
           <button onClick={() => setSubmitted(false)} className="bg-white text-green-700 font-bold px-6 py-2 rounded-xl border border-green-200 hover:bg-green-100 transition-colors">
              Submit Another Report
           </button>
        </div>
      ) : (
        <div className="bg-surface rounded-3xl border border-gray-200 shadow-card p-8 md:p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div 
                   onClick={() => setIssueType('Hardware Defect')}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${issueType === 'Hardware Defect' ? 'border-primary bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                   <PenTool size={24} className={issueType === 'Hardware Defect' ? 'text-primary' : 'text-gray-400'} />
                   <span className={`font-bold ${issueType === 'Hardware Defect' ? 'text-primary' : 'text-secondary'}`}>Hardware Defect</span>
                </div>
                <div 
                   onClick={() => setIssueType('Software Bug')}
                   className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-2 ${issueType === 'Software Bug' ? 'border-primary bg-gray-50' : 'border-gray-100 hover:border-gray-200'}`}
                >
                   <Bug size={24} className={issueType === 'Software Bug' ? 'text-primary' : 'text-gray-400'} />
                   <span className={`font-bold ${issueType === 'Software Bug' ? 'text-primary' : 'text-secondary'}`}>Website Bug</span>
                </div>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Subject</label>
                <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium" placeholder="e.g., Arduino Uno pin 13 not working" />
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Description</label>
                <textarea required rows={5} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium resize-none" placeholder="Please describe the issue in detail..."></textarea>
             </div>

             <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Priority Level</label>
                <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium cursor-pointer">
                   <option>Low - Minor inconvenience</option>
                   <option>Medium - Affects usage</option>
                   <option>High - Critical failure</option>
                </select>
             </div>

             <button type="submit" className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 mt-4">
                Submit Report <Send size={18} />
             </button>
          </form>
        </div>
      )}
    </div>
  );
};