import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Lightbulb, ArrowRight, Clock, Check, FileText, ExternalLink } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';

export const ProblemStatements: React.FC = () => {
  const { problemStatements, user } = useApp();
  const [selectedProblem, setSelectedProblem] = useState<string | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);
  const [isGuidelinesOpen, setIsGuidelinesOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Submission Form State
  const [submissionLink, setSubmissionLink] = useState('');
  const [teamName, setTeamName] = useState('');

  // Sort by deadline (closest first)
  const sortedProblems = [...problemStatements].sort((a, b) => 
    new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
  );

  const openSubmitModal = (problemId: string) => {
    setSelectedProblem(problemId);
    setSubmissionLink('');
    setTeamName('');
    setIsSubmitOpen(true);
  };

  const handleSubmitSolution = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitOpen(false);
    setShowToast(true);
    // In a real app, this would send data to backend
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-12">
      {showToast && (
        <Toast 
          message="Solution submitted successfully! Good luck." 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">Problem Statements</h1>
          <p className="text-secondary mt-2 text-lg">Challenge yourself with real-world engineering problems.</p>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl border border-yellow-100 font-medium text-sm">
           <Lightbulb size={18} />
           <span>{problemStatements.length} Active Challenges</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {sortedProblems.map(problem => {
          const daysLeft = Math.ceil((new Date(problem.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          const isUrgent = daysLeft > 0 && daysLeft <= 3;
          const isExpired = daysLeft < 0;

          return (
            <div key={problem.id} className="bg-surface rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-card transition-all group relative overflow-hidden">
               {/* Decorative Gradient Bar */}
               <div className={`absolute left-0 top-0 bottom-0 w-2 ${isExpired ? 'bg-gray-300' : isUrgent ? 'bg-red-500' : 'bg-primary'}`}></div>

               <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                     <div className="flex items-start justify-between">
                        <h2 className="text-2xl font-bold text-primary group-hover:text-accent transition-colors">{problem.title}</h2>
                        {isUrgent && (
                           <span className="bg-red-50 text-red-600 text-xs font-bold px-3 py-1 rounded-full border border-red-100 animate-pulse">
                              Ending Soon
                           </span>
                        )}
                        {isExpired && (
                           <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                              Closed
                           </span>
                        )}
                     </div>
                     <p className="text-secondary leading-relaxed text-base whitespace-pre-wrap">
                        {problem.description}
                     </p>
                     
                     <div className="flex items-center gap-6 pt-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-secondary bg-gray-50 px-3 py-1.5 rounded-lg">
                           <Calendar size={16} />
                           <span>Deadline: <span className={`font-bold ${isUrgent ? 'text-red-600' : 'text-primary'}`}>{problem.deadline}</span></span>
                        </div>
                        {daysLeft > 0 && (
                           <div className="flex items-center gap-2 text-sm font-medium text-secondary">
                              <Clock size={16} />
                              <span>{daysLeft} days remaining</span>
                           </div>
                        )}
                     </div>
                  </div>

                  <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-gray-100 md:pl-8 pt-6 md:pt-0 gap-3 min-w-[200px]">
                     <button 
                        onClick={() => openSubmitModal(problem.id)}
                        disabled={isExpired} 
                        className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                     >
                        Submit Solution <ArrowRight size={18} />
                     </button>
                     <button 
                        onClick={() => setIsGuidelinesOpen(true)}
                        className="w-full bg-white border border-gray-200 text-primary font-bold py-3 px-6 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                     >
                        View Guidelines
                     </button>
                  </div>
               </div>
            </div>
          );
        })}

        {sortedProblems.length === 0 && (
           <div className="text-center py-20 bg-surface rounded-3xl border border-gray-200 border-dashed">
              <Lightbulb size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">No active problems at the moment</h3>
              <p className="text-gray-400 mt-2">Check back later for new challenges.</p>
           </div>
        )}
      </div>

      {/* Submit Solution Modal */}
      <Modal isOpen={isSubmitOpen} onClose={() => setIsSubmitOpen(false)} title="Submit Solution">
        <form onSubmit={handleSubmitSolution} className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 flex gap-3">
             <div className="text-blue-600 mt-0.5"><Lightbulb size={18} /></div>
             <p className="text-sm text-blue-800">You are submitting a solution for <span className="font-bold">{problemStatements.find(p => p.id === selectedProblem)?.title}</span></p>
          </div>
          
          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Team Name</label>
            <input 
              required
              type="text" 
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium"
              placeholder="e.g. Code Warriors"
            />
          </div>

          <div>
            <label className="text-xs text-secondary uppercase font-bold mb-2 block">Project Repository / Link</label>
            <div className="relative">
              <ExternalLink size={18} className="absolute left-3 top-3.5 text-gray-400" />
              <input 
                required
                type="url" 
                value={submissionLink}
                onChange={(e) => setSubmissionLink(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 pl-10 text-primary focus:border-primary outline-none font-medium"
                placeholder="https://github.com/..."
              />
            </div>
            <p className="text-xs text-gray-400 mt-2">Please ensure the repository is public or accessible to admins.</p>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
             Confirm Submission <Check size={18} />
          </button>
        </form>
      </Modal>

      {/* Guidelines Modal */}
      <Modal isOpen={isGuidelinesOpen} onClose={() => setIsGuidelinesOpen(false)} title="Submission Guidelines">
        <div className="space-y-6">
           <div className="space-y-4">
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0">1</div>
                 <div>
                    <h4 className="font-bold text-primary mb-1">Code Quality</h4>
                    <p className="text-sm text-secondary">Ensure your code is well-documented, clean, and follows standard conventions. Include a README.md file.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0">2</div>
                 <div>
                    <h4 className="font-bold text-primary mb-1">Submission Format</h4>
                    <p className="text-sm text-secondary">We accept GitHub/GitLab repository links or Google Drive links for design documents.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0">3</div>
                 <div>
                    <h4 className="font-bold text-primary mb-1">Team Size</h4>
                    <p className="text-sm text-secondary">Teams can have a maximum of 4 members. Cross-department teams are encouraged.</p>
                 </div>
              </div>
              <div className="flex gap-4">
                 <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-primary flex-shrink-0">4</div>
                 <div>
                    <h4 className="font-bold text-primary mb-1">Originality</h4>
                    <p className="text-sm text-secondary">Plagiarism will lead to immediate disqualification. Ensure your solution is original.</p>
                 </div>
              </div>
           </div>
           
           <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-sm text-yellow-800">
              <strong>Note:</strong> Late submissions will not be accepted. If you face technical issues, contact the admin immediately via Live Chat.
           </div>

           <button onClick={() => setIsGuidelinesOpen(false)} className="w-full bg-gray-100 hover:bg-gray-200 text-primary font-bold py-3 rounded-xl transition-colors">
              I Understand
           </button>
        </div>
      </Modal>
    </div>
  );
};