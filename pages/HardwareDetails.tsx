import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, ShoppingCart, Check, AlertCircle, Package, Shield, Zap, FileText, Cpu, Layers, Download, ExternalLink } from 'lucide-react';
import { Toast } from '../components/Toast';

export const HardwareDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hardware, addToCart, cart } = useApp();
  const [showToast, setShowToast] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'docs'>('desc');

  const item = hardware.find(h => h.id === id);

  if (!item) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-primary">Item not found</h2>
        <button onClick={() => navigate('/hardware')} className="text-accent mt-4 font-bold hover:underline">Back to Catalog</button>
      </div>
    );
  }

  const isInCart = cart.some(c => c.id === item.id);

  const handleAddToCart = () => {
    addToCart(item);
    setShowToast(true);
  };

  // Mock specific details based on item to make it look "more detailed"
  const features = [
    "High performance industrial grade components",
    "Compatible with standard development environments",
    "Low power consumption design",
    "RoHS Compliant",
    "Extended operating temperature range -40°C to 85°C"
  ];

  const specs = [
    { label: "Operating Voltage", value: "3.3V / 5V" },
    { label: "Input Voltage", value: "7-12V" },
    { label: "Digital I/O Pins", value: "14 (6 PWM)" },
    { label: "Analog Input Pins", value: "6" },
    { label: "Flash Memory", value: "32 KB" },
    { label: "Clock Speed", value: "16 MHz" },
  ];

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {showToast && (
        <Toast 
          message={`${item.name} added to cart!`} 
          type="success" 
          onClose={() => setShowToast(false)} 
        />
      )}

      <button onClick={() => navigate('/hardware')} className="flex items-center gap-2 text-secondary hover:text-primary font-bold mb-6 transition-colors text-sm">
        <ArrowLeft size={18} /> Back to Catalog
      </button>

      <div className="bg-surface rounded-3xl border border-gray-200 shadow-sm overflow-hidden mb-8">
        <div className="flex flex-col md:flex-row">
          {/* Left Column: Image (Compact) */}
          <div className="md:w-1/3 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200 flex items-center justify-center">
             <div className="relative w-full max-w-[280px] aspect-square bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-center">
               <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
               {!item.available && (
                  <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center rounded-2xl">
                     <span className="bg-red-500 text-white px-4 py-1.5 rounded-full font-bold uppercase text-xs tracking-wider shadow-lg">Out of Stock</span>
                  </div>
               )}
             </div>
          </div>

          {/* Right Column: Key Details & Actions */}
          <div className="md:w-2/3 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-purple-50 text-accent px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-purple-100">
                {item.category}
              </span>
              {item.available ? (
                <span className="flex items-center gap-1.5 text-green-600 text-xs font-bold bg-green-50 px-3 py-1 rounded-full border border-green-100">
                  <Check size={14} /> In Stock
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
                  <AlertCircle size={14} /> Unavailable
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-primary mb-3">{item.name}</h1>
            <div className="flex items-center gap-4 mb-6">
               <div className="flex items-baseline gap-1">
                 <span className="text-3xl font-bold text-primary">₹{item.pricePerDay}</span>
                 <span className="text-sm text-secondary font-medium">/ day</span>
               </div>
               <div className="h-8 w-px bg-gray-200"></div>
               <div className="text-sm text-secondary">
                 <span className="font-bold text-primary block">{item.stock}</span>
                 Available Units
               </div>
            </div>

            <p className="text-secondary leading-relaxed mb-6">{item.description}</p>

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
               {isInCart ? (
                 <button 
                   onClick={() => navigate('/cart')}
                   className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                 >
                   Go to Cart <ShoppingCart size={20} />
                 </button>
               ) : (
                 <button 
                   onClick={handleAddToCart}
                   disabled={!item.available}
                   className="flex-1 bg-primary hover:bg-gray-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                   Add to Cart <ShoppingCart size={20} />
                 </button>
               )}
               <button className="px-6 py-3.5 border border-gray-200 text-primary font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  Add to Wishlist
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Tabs */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
               <div className="flex border-b border-gray-100 overflow-x-auto">
                  <button 
                    onClick={() => setActiveTab('desc')}
                    className={`px-8 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'desc' ? 'text-primary border-b-2 border-primary bg-gray-50' : 'text-secondary hover:text-primary'}`}
                  >
                    Description & Features
                  </button>
                  <button 
                    onClick={() => setActiveTab('specs')}
                    className={`px-8 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'specs' ? 'text-primary border-b-2 border-primary bg-gray-50' : 'text-secondary hover:text-primary'}`}
                  >
                    Technical Specifications
                  </button>
                  <button 
                    onClick={() => setActiveTab('docs')}
                    className={`px-8 py-4 text-sm font-bold transition-colors whitespace-nowrap ${activeTab === 'docs' ? 'text-primary border-b-2 border-primary bg-gray-50' : 'text-secondary hover:text-primary'}`}
                  >
                    Documentation
                  </button>
               </div>

               <div className="p-8">
                  {activeTab === 'desc' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="prose prose-sm max-w-none text-secondary">
                           <p className="leading-relaxed text-base">
                              This {item.name} is a high-quality component selected specifically for the Sona College innovation labs. 
                              It offers reliable performance for student projects, hackathons, and research initiatives. 
                              Whether you are building a robot, an IoT device, or learning the basics of electronics, 
                              this component provides the standard interface and durability required for academic use.
                           </p>
                        </div>
                        
                        <div>
                           <h3 className="font-bold text-primary mb-4 flex items-center gap-2">
                              <Zap size={18} className="text-accent" /> Key Features
                           </h3>
                           <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {features.map((feature, idx) => (
                                 <li key={idx} className="flex items-start gap-2 text-sm text-secondary">
                                    <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>{feature}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     </div>
                  )}

                  {activeTab === 'specs' && (
                     <div className="animate-in fade-in duration-300">
                        <div className="overflow-hidden rounded-xl border border-gray-100">
                           <table className="w-full text-sm text-left">
                              <tbody className="divide-y divide-gray-100">
                                 {specs.map((spec, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                       <td className="px-6 py-4 font-medium text-secondary">{spec.label}</td>
                                       <td className="px-6 py-4 font-bold text-primary">{spec.value}</td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 italic">* Specifications are simulated for demo purposes.</p>
                     </div>
                  )}

                  {activeTab === 'docs' && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-sm transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                 <FileText size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-primary group-hover:text-accent transition-colors">Datasheet (PDF)</h4>
                                 <p className="text-xs text-secondary">Technical Reference Manual</p>
                              </div>
                           </div>
                           <Download size={18} className="text-gray-400 group-hover:text-primary" />
                        </div>
                        
                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-sm transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center">
                                 <Layers size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-primary group-hover:text-accent transition-colors">Schematic Diagram</h4>
                                 <p className="text-xs text-secondary">Circuit Design & Pinout</p>
                              </div>
                           </div>
                           <Download size={18} className="text-gray-400 group-hover:text-primary" />
                        </div>

                        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-primary hover:shadow-sm transition-all group cursor-pointer">
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center">
                                 <ExternalLink size={20} />
                              </div>
                              <div>
                                 <h4 className="font-bold text-primary group-hover:text-accent transition-colors">Driver & Libraries</h4>
                                 <p className="text-xs text-secondary">External Manufacturer Link</p>
                              </div>
                           </div>
                           <ExternalLink size={18} className="text-gray-400 group-hover:text-primary" />
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>

         {/* Sidebar */}
         <div className="space-y-6">
            <div className="bg-surface p-6 rounded-3xl border border-gray-200 shadow-sm">
               <h3 className="font-bold text-primary mb-4 text-sm uppercase tracking-wider">What's in the Box</h3>
               <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-secondary">
                     <Package size={16} className="text-gray-400" />
                     <span>1x {item.name} Unit</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-secondary">
                     <Package size={16} className="text-gray-400" />
                     <span>1x Anti-static Bag</span>
                  </li>
                  <li className="flex items-center gap-3 text-sm text-secondary">
                     <Package size={16} className="text-gray-400" />
                     <span>Quick Start Guide</span>
                  </li>
               </ul>
            </div>

            <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
               <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Shield size={18} /> Lab Warranty
               </h3>
               <p className="text-sm text-blue-700 leading-relaxed">
                  This item is verified by the IC Club Lab Admin. Please return it in the same condition. Damaged items will incur a replacement fee.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};