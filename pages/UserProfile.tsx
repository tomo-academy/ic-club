
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, Hash, Save, Shield, Camera, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Toast } from '../components/Toast';

export const UserProfile: React.FC = () => {
  const { user, updateUserProfile } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState({
     name: '',
     phone: '',
     email: '', 
     rollNumber: '',
     department: '',
     year: '',
     avatar: ''
  });

  useEffect(() => {
    if (user) {
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            email: user.email || '',
            rollNumber: user.rollNumber || '',
            department: user.department || '',
            year: user.year || '',
            avatar: user.avatar || ''
        });
    }
  }, [user]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^[6-9]\d{9}$/; 
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (formData.phone && !phoneRegex.test(formData.phone)) newErrors.phone = "Invalid 10-digit phone number";
    if (formData.email && !emailRegex.test(formData.email)) newErrors.email = "Invalid email address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    updateUserProfile({
        name: formData.name,
        phone: formData.phone,
        email: formData.email, 
        rollNumber: formData.rollNumber,
        department: formData.department,
        year: formData.year,
        avatar: formData.avatar
    });
    setIsEditing(false);
    setShowToast(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: val });
    if (errors.phone) setErrors({ ...errors, phone: '' });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {showToast && (
         <Toast message="Profile updated successfully!" type="success" onClose={() => setShowToast(false)} />
       )}

       <div className="relative">
          {/* Header Banner */}
          <div className="h-40 bg-gradient-to-r from-primary to-gray-800 rounded-t-3xl"></div>
          
          <div className="px-8 pb-8 bg-surface border border-t-0 border-gray-200 rounded-b-3xl shadow-card relative">
             <div className="flex flex-col md:flex-row gap-6 items-end -mt-12 mb-6">
                
                {/* Avatar Section */}
                <div className="relative group">
                   <div className="w-32 h-32 rounded-3xl bg-white p-1 shadow-xl overflow-hidden">
                      {formData.avatar ? (
                          <img src={formData.avatar} alt={user.name} className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                          <div className="w-full h-full bg-primary text-white rounded-2xl flex items-center justify-center text-4xl font-bold">
                             {user.name.charAt(0)}
                          </div>
                      )}
                   </div>
                   
                   {isEditing && (
                      <div className="absolute inset-0 bg-black/40 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                         <label htmlFor="avatar-upload" className="cursor-pointer text-white flex flex-col items-center">
                            <Camera size={24} />
                            <span className="text-xs font-bold mt-1">Change</span>
                         </label>
                         <input 
                            id="avatar-upload" 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileChange}
                         />
                      </div>
                   )}
                </div>

                <div className="flex-1 pb-2">
                   {isEditing ? (
                       <div>
                           <input 
                             type="text"
                             value={formData.name}
                             onChange={e => { setFormData({...formData, name: e.target.value}); if(errors.name) setErrors({...errors, name: ''})}}
                             className={`text-3xl font-bold text-primary bg-transparent border-b outline-none w-full md:w-auto ${errors.name ? 'border-red-500' : 'border-gray-300 focus:border-primary'}`}
                           />
                           {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                       </div>
                   ) : (
                       <h1 className="text-3xl font-bold text-primary">{user.name}</h1>
                   )}
                   
                   <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-bold border border-gray-200 uppercase tracking-wider">{user.role}</span>
                      <span className="text-secondary text-sm">{user.email}</span>
                   </div>
                   
                   {/* URL Input for Avatar (Only in Edit Mode) */}
                   {isEditing && (
                      <div className="mt-3 flex items-center gap-2">
                         <LinkIcon size={14} className="text-gray-400" />
                         <input 
                           type="text" 
                           placeholder="Or paste image URL..." 
                           value={formData.avatar.startsWith('data:') ? '' : formData.avatar}
                           onChange={e => setFormData({...formData, avatar: e.target.value})}
                           className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-full max-w-xs focus:outline-none focus:border-primary"
                         />
                      </div>
                   )}
                </div>

                <div className="pb-2">
                  {!isEditing ? (
                    <button onClick={() => setIsEditing(true)} className="bg-white border border-gray-200 text-primary px-6 py-2.5 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors">
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button onClick={() => { setIsEditing(false); setErrors({}); setFormData({...formData, avatar: user.avatar || ''}); }} className="text-secondary font-bold px-4 py-2 hover:text-primary">Cancel</button>
                      <button onClick={handleSave} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-gray-200 flex items-center gap-2">
                         <Save size={16} /> Save Changes
                      </button>
                    </div>
                  )}
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                {/* Personal Information */}
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <User size={20} /> Personal Information
                   </h3>
                   <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Full Name</label>
                         <p className="text-primary font-medium">{user.name}</p>
                      </div>
                      <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-white border-primary ring-1 ring-primary' : 'bg-gray-50 border-gray-100'}`}>
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block flex items-center gap-1"><Mail size={12}/> Email Address</label>
                         {isEditing ? (
                            <>
                                <input 
                                  type="text" 
                                  value={formData.email} 
                                  onChange={(e) => { setFormData({...formData, email: e.target.value}); if(errors.email) setErrors({...errors, email: ''})}}
                                  className="w-full bg-transparent outline-none font-medium text-primary"
                                />
                                {errors.email && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.email}</p>}
                            </>
                         ) : (
                            <p className="text-primary font-medium">{user.email}</p>
                         )}
                      </div>
                      <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-white border-primary ring-1 ring-primary' : 'bg-gray-50 border-gray-100'}`}>
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block flex items-center gap-1"><Phone size={12}/> Phone Number</label>
                         {isEditing ? (
                            <>
                                <input 
                                  type="text" 
                                  value={formData.phone} 
                                  onChange={handlePhoneChange}
                                  className="w-full bg-transparent outline-none font-medium text-primary"
                                  placeholder="+91 9876543210"
                                  maxLength={10}
                                />
                                {errors.phone && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10}/> {errors.phone}</p>}
                            </>
                         ) : (
                            <p className="text-primary font-medium">{formData.phone || 'Not set'}</p>
                         )}
                      </div>
                   </div>
                </div>

                {/* Academic Details */}
                <div className="space-y-6">
                   <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                      <Shield size={20} /> Academic Details
                   </h3>
                   <div className="space-y-4">
                      <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-white border-primary ring-1 ring-primary' : 'bg-gray-50 border-gray-100'}`}>
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block flex items-center gap-1"><Hash size={12}/> Roll Number</label>
                         {isEditing ? (
                            <input 
                              type="text" 
                              value={formData.rollNumber} 
                              onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                              className="w-full bg-transparent outline-none font-medium text-primary"
                              placeholder="e.g. 19IT101"
                            />
                         ) : (
                            <p className="text-primary font-medium">{formData.rollNumber || 'Not set'}</p>
                         )}
                      </div>
                      <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-white border-primary ring-1 ring-primary' : 'bg-gray-50 border-gray-100'}`}>
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Department</label>
                         {isEditing ? (
                            <input 
                              type="text" 
                              value={formData.department} 
                              onChange={(e) => setFormData({...formData, department: e.target.value})}
                              className="w-full bg-transparent outline-none font-medium text-primary"
                              placeholder="e.g. Information Technology"
                            />
                         ) : (
                            <p className="text-primary font-medium">{formData.department || 'Not set'}</p>
                         )}
                      </div>
                      <div className={`p-4 rounded-xl border transition-colors ${isEditing ? 'bg-white border-primary ring-1 ring-primary' : 'bg-gray-50 border-gray-100'}`}>
                         <label className="text-xs font-bold text-secondary uppercase tracking-wider mb-1 block">Year of Study</label>
                         {isEditing ? (
                            <select 
                              value={formData.year} 
                              onChange={(e) => setFormData({...formData, year: e.target.value})}
                              className="w-full bg-transparent outline-none font-medium text-primary"
                            >
                                <option value="">Select Year</option>
                                <option value="1st Year">1st Year</option>
                                <option value="2nd Year">2nd Year</option>
                                <option value="3rd Year">3rd Year</option>
                                <option value="4th Year">4th Year</option>
                            </select>
                         ) : (
                            <p className="text-primary font-medium">{formData.year || 'Not set'}</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
