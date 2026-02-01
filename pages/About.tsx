import React from 'react';
import { Target, Users, Zap, Award, Globe, Rocket } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-12">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-10">
        <h1 className="text-5xl font-bold text-primary tracking-tight">Innovation Starts Here</h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto leading-relaxed">
          The IC Club at Sona College of Technology is a melting pot of creativity, engineering, and future-forward thinking.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-card transition-shadow">
          <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-accent mb-6">
            <Target size={24} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Our Mission</h2>
          <p className="text-secondary leading-relaxed">
            To provide a collaborative platform for students to explore emerging technologies, access high-quality hardware resources, and solve real-world problems through engineering excellence.
          </p>
        </div>
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-card transition-shadow">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
            <Zap size={24} />
          </div>
          <h2 className="text-2xl font-bold text-primary mb-4">Our Vision</h2>
          <p className="text-secondary leading-relaxed">
            To be the premier innovation hub in the region, fostering a culture of "Make in India" and producing industry-ready engineers capable of building sustainable solutions.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-primary rounded-3xl p-10 text-white shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Members</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">50+</div>
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Projects</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">12</div>
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Awards</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">24/7</div>
            <div className="text-gray-400 text-sm font-medium uppercase tracking-wider">Lab Access</div>
          </div>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="space-y-8">
        <h2 className="text-3xl font-bold text-primary text-center">Why Join IC Club?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-6 rounded-2xl border border-gray-200 text-center">
             <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary mb-4">
               <Globe size={20} />
             </div>
             <h3 className="font-bold text-lg mb-2">Networking</h3>
             <p className="text-sm text-secondary">Connect with like-minded peers and alumni mentors.</p>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-gray-200 text-center">
             <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary mb-4">
               <Rocket size={20} />
             </div>
             <h3 className="font-bold text-lg mb-2">Hardware Access</h3>
             <p className="text-sm text-secondary">Free access to Arduino, Raspberry Pi, Drones, and sensors.</p>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-gray-200 text-center">
             <div className="mx-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-primary mb-4">
               <Award size={20} />
             </div>
             <h3 className="font-bold text-lg mb-2">Certifications</h3>
             <p className="text-sm text-secondary">Earn certificates for workshops and project completions.</p>
          </div>
        </div>
      </div>
    </div>
  );
};