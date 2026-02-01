import React, { useState } from 'react';
import { Mail, MapPin, Phone, Send } from 'lucide-react';

export const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Simulate API call
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-4">Get in Touch</h1>
        <p className="text-secondary max-w-xl mx-auto">
          Have a question about club membership, hardware availability, or upcoming events? We are here to help.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Contact Info */}
        <div className="space-y-8">
           <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-primary">Sona College of Technology</p>
                     <p className="text-secondary text-sm mt-1">Junction Main Road, Salem,<br/>Tamil Nadu 636005</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                     <Mail size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-primary">Email Us</p>
                     <p className="text-secondary text-sm mt-1">support@icclub.sona.edu</p>
                     <p className="text-secondary text-sm">president@icclub.sona.edu</p>
                   </div>
                </div>
                <div className="flex items-start gap-4">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                     <Phone size={20} />
                   </div>
                   <div>
                     <p className="font-bold text-primary">Call Us</p>
                     <p className="text-secondary text-sm mt-1">+91 427 4099 999 (College Office)</p>
                   </div>
                </div>
              </div>
           </div>

           {/* Map Placeholder */}
           <div className="h-64 bg-gray-200 rounded-3xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center text-secondary">
                 <span className="flex items-center gap-2"><MapPin /> Map View Loaded</span>
              </div>
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3907.683375837651!2d78.1731663148117!3d11.644131991736612!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf0619c959771%3A0x629538356238382d!2sSona%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1625634567890!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0, opacity: 0.6 }} 
                allowFullScreen={true} 
                loading="lazy"
              ></iframe>
           </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-card">
           <h3 className="text-xl font-bold text-primary mb-6">Send us a Message</h3>
           {submitted ? (
             <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send size={24} />
                </div>
                <h4 className="text-lg font-bold text-primary mb-2">Message Sent!</h4>
                <p className="text-secondary">Thank you for contacting us. We will get back to you shortly.</p>
                <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-bold text-primary underline">Send another</button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
               <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-secondary uppercase">First Name</label>
                   <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none" placeholder="John" />
                 </div>
                 <div className="space-y-2">
                   <label className="text-xs font-bold text-secondary uppercase">Last Name</label>
                   <input required type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none" placeholder="Doe" />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-secondary uppercase">Email</label>
                 <input required type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none" placeholder="john@example.com" />
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-secondary uppercase">Subject</label>
                 <select className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none cursor-pointer">
                   <option>General Inquiry</option>
                   <option>Membership Issue</option>
                   <option>Hardware Request</option>
                   <option>Project Collaboration</option>
                 </select>
               </div>
               <div className="space-y-2">
                 <label className="text-xs font-bold text-secondary uppercase">Message</label>
                 <textarea required rows={4} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none" placeholder="How can we help you?"></textarea>
               </div>
               <button type="submit" className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2">
                 Send Message <Send size={18} />
               </button>
             </form>
           )}
        </div>
      </div>
    </div>
  );
};