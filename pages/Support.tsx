import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, FileText, AlertCircle, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-2xl bg-surface overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-bold text-primary">{question}</span>
        {isOpen ? <ChevronUp size={20} className="text-secondary" /> : <ChevronDown size={20} className="text-secondary" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-6 text-secondary text-sm leading-relaxed border-t border-gray-100 pt-4">
          {answer}
        </div>
      )}
    </div>
  );
};

export const Support: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Help Center</h1>
        <p className="text-secondary max-w-xl mx-auto">
           Find answers to common questions about the IC Club management system and hardware rentals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <Link to="/user-guide" className="bg-surface p-6 rounded-2xl border border-gray-200 text-center hover:shadow-card transition-shadow cursor-pointer block">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <FileText size={24} />
            </div>
            <h3 className="font-bold text-primary mb-2">User Guide</h3>
            <p className="text-xs text-secondary">Learn how to use the dashboard and booking system.</p>
         </Link>
         <Link to="/report-issue" className="bg-surface p-6 rounded-2xl border border-gray-200 text-center hover:shadow-card transition-shadow cursor-pointer block">
            <div className="w-12 h-12 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle size={24} />
            </div>
            <h3 className="font-bold text-primary mb-2">Report Issue</h3>
            <p className="text-xs text-secondary">Found a bug or hardware defect? Let us know.</p>
         </Link>
         <Link to="/live-chat" className="bg-surface p-6 rounded-2xl border border-gray-200 text-center hover:shadow-card transition-shadow cursor-pointer block">
            <div className="w-12 h-12 bg-purple-50 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
               <MessageCircle size={24} />
            </div>
            <h3 className="font-bold text-primary mb-2">Live Chat</h3>
            <p className="text-xs text-secondary">Chat with an admin for immediate assistance.</p>
         </Link>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-primary">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <FAQItem 
            question="How do I rent hardware components?"
            answer="Log in to your dashboard, navigate to the 'Hardware' section, browse the catalog, and click 'Prebook' on the items you need. Follow the booking flow to confirm your request."
          />
          <FAQItem 
            question="How long can I keep the components?"
            answer="Standard rental duration is 7 days. If you need it for longer, you must request an extension via the dashboard or speak to the club admin before the due date."
          />
          <FAQItem 
            question="What happens if I damage a component?"
            answer="Accidents happen! Please report any damage immediately. Depending on the extent of the damage and the cause, you may be asked to replace the component or pay a fine."
          />
          <FAQItem 
            question="Can I request components not listed in the inventory?"
            answer="Yes! Use the 'Community' feed to post a request or contact the admin directly. We regularly update our inventory based on student needs."
          />
          <FAQItem 
            question="How do I join the club?"
            answer="Membership is open to all students of Sona College. You can register online via the login page or visit us at the Main Block, 2nd Floor during club hours."
          />
        </div>
      </div>

      <div className="bg-gray-50 rounded-3xl p-8 text-center border border-gray-200">
         <h3 className="text-lg font-bold text-primary mb-2">Still need help?</h3>
         <p className="text-secondary text-sm mb-6">Our support team is just a click away.</p>
         <Link to="/report-issue" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all">
            Open Support Ticket
         </Link>
      </div>
    </div>
  );
};