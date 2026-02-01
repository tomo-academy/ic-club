
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Check, CreditCard, FileText, Download, Home, QrCode, ShieldCheck, Mail, MapPin, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { LOCATIONS, STREET_SUGGESTIONS, GENERIC_STREETS } from '../constants';
import { HardwareItem } from '../types';

const StepIndicator = ({ current, step, icon: Icon, label }: any) => {
  const isActive = current === step;
  const isCompleted = current > step;
  
  return (
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm
        ${isActive ? 'bg-primary text-white shadow-lg shadow-gray-200' : 
          isCompleted ? 'bg-green-500 text-white' : 'bg-white border border-gray-200 text-gray-400'}`}>
        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
      </div>
      <span className={`text-sm font-bold hidden md:block ${isActive ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
    </div>
  );
};

// Types for Address Form
interface AddressFormState {
  country: string;
  state: string;
  city: string;
  pincode: string;
  houseNo: string;
  roadName: string;
  type: 'Home' | 'Work' | 'Other';
}

export const BookingFlow: React.FC = () => {
  const { cart, user, placeOrder } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderResult, setOrderResult] = useState<any>(null);
  
  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Determine items to checkout based on navigation state or fallback to entire cart
  const [checkoutItems, setCheckoutItems] = useState<HardwareItem[]>([]);

  useEffect(() => {
    const selectedIds = location.state?.selectedItemIds as string[] | undefined;
    if (selectedIds && selectedIds.length > 0) {
       setCheckoutItems(cart.filter(item => selectedIds.includes(item.id)));
    } else {
       setCheckoutItems(cart);
    }
  }, [cart, location.state]);

  // Address Modal State
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [addressForm, setAddressForm] = useState<AddressFormState>({
    country: 'India',
    state: '',
    city: '',
    pincode: '',
    houseNo: '',
    roadName: '',
    type: 'Home'
  });
  
  // Autocomplete State
  const [roadSuggestions, setRoadSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const [details, setDetails] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '', // Stores the formatted address string
    collegeId: user?.rollNumber || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Validation Logic
  const validateDetails = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;

    if (!details.fullName) newErrors.fullName = "Name is required";
    if (!details.email || !emailRegex.test(details.email)) newErrors.email = "Invalid email address";
    if (!details.phone || !phoneRegex.test(details.phone)) newErrors.phone = "Invalid 10-digit phone number";
    if (!details.collegeId) newErrors.collegeId = "College ID is required";
    if (!details.address) newErrors.address = "Please select a delivery address";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateAddressForm = () => {
    const newErrors: Record<string, string> = {};
    if (!addressForm.state) newErrors.state = "State is required";
    if (!addressForm.city) newErrors.city = "City is required";
    if (!addressForm.pincode || addressForm.pincode.length < 6) newErrors.pincode = "Valid Pincode required";
    if (!addressForm.houseNo) newErrors.houseNo = "House/Building No. required";
    if (!addressForm.roadName) newErrors.roadName = "Road/Area required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const val = e.target.value.replace(/\D/g, '').slice(0, 10);
     setDetails({...details, phone: val});
     if (errors.phone) setErrors({...errors, phone: ''});
  };

  // Address AutoComplete Logic
  const handleRoadNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     const value = e.target.value;
     setAddressForm({...addressForm, roadName: value});
     
     if (value.length > 0) {
        const citySpecific = STREET_SUGGESTIONS[addressForm.city] || GENERIC_STREETS;
        const filtered = citySpecific.filter(street => 
           street.toLowerCase().includes(value.toLowerCase())
        );
        setRoadSuggestions(filtered);
        setShowSuggestions(true);
     } else {
        setShowSuggestions(false);
     }
  };

  const selectSuggestion = (street: string) => {
     setAddressForm({...addressForm, roadName: street});
     setShowSuggestions(false);
  };

  // Redirect if no items (and not on receipt step)
  useEffect(() => {
     if (checkoutItems.length === 0 && step !== 4 && cart.length === 0) {
        // Logic handled in render mostly
     }
  }, [checkoutItems, cart, step]);

  if (checkoutItems.length === 0 && step !== 4) {
     return (
        <div className="text-center py-20">
           <h2 className="text-2xl font-bold text-primary mb-4">No Items to Checkout</h2>
           <button onClick={() => navigate('/hardware')} className="text-accent hover:underline font-bold">Browse Hardware</button>
        </div>
     );
  }

  const handleNext = async () => {
    if (step === 1) {
      if (validateDetails()) {
        setStep(2);
      }
    } else if (step === 3) {
      setLoading(true);
      // Pass the specific checkout items to placeOrder
      const order = await placeOrder(details, checkoutItems);
      setOrderResult(order);
      setLoading(false);
      setStep(4);
    } else {
      setStep(step + 1);
    }
  };

  const handleSaveAddress = () => {
    if (validateAddressForm()) {
      const formattedAddress = `${addressForm.houseNo}, ${addressForm.roadName}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pincode}, ${addressForm.country}`;
      setDetails({ ...details, address: formattedAddress });
      setIsAddressModalOpen(false);
      // Clear address errors
      const { address, ...restErrors } = errors;
      setErrors(restErrors);
    }
  };

  const handleDownloadInvoice = () => {
     setToastMessage(`Invoice receipt sent to ${orderResult?.userEmail || 'email'}`);
     setShowToast(true);
     setTimeout(() => {
        window.print();
     }, 1500);
  };

  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.pricePerDay, 0);
  const returnDate = new Date();
  returnDate.setDate(returnDate.getDate() + 7);

  // Generate QR Code URL
  const orderUrl = orderResult ? `${window.location.origin}/#/order/${orderResult.id}` : '';
  const qrCodeApiUrl = orderResult ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}&color=111827` : '';

  return (
    <div className="max-w-4xl mx-auto">
      {/* Toast */}
      {showToast && <Toast message={toastMessage} type="success" onClose={() => setShowToast(false)} />}
      
      {/* Print Styles */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            #receipt-container, #receipt-container * {
              visibility: visible;
            }
            #receipt-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              box-shadow: none;
              border: none;
            }
            .no-print {
              display: none !important;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* Steps Header (Hidden on Receipt Step) */}
      {step !== 4 && (
        <div className="flex justify-between items-center mb-16 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
          <StepIndicator current={step} step={1} icon={FileText} label="Details" />
          <StepIndicator current={step} step={2} icon={CreditCard} label="Payment" />
          <StepIndicator current={step} step={3} icon={Check} label="Confirm" />
          <StepIndicator current={step} step={4} icon={Download} label="Receipt" />
        </div>
      )}

      {/* Step 1: User Details & Address */}
      {step === 1 && (
        <div className="bg-surface p-10 rounded-3xl border border-gray-200 shadow-card animate-in fade-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-primary mb-8">Booking Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-xs text-secondary uppercase font-bold ml-1">Full Name</label>
              <input 
                type="text" 
                value={details.fullName} 
                onChange={e => setDetails({...details, fullName: e.target.value})} 
                className={`w-full bg-gray-50 border rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium ${errors.fullName ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.fullName && <p className="text-xs text-red-500 ml-1">{errors.fullName}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs text-secondary uppercase font-bold ml-1">Email</label>
              <input 
                type="email" 
                value={details.email} 
                onChange={e => setDetails({...details, email: e.target.value})} 
                className={`w-full bg-gray-50 border rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium ${errors.email ? 'border-red-500' : 'border-gray-200'}`} 
              />
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs text-secondary uppercase font-bold ml-1">College ID / Roll No</label>
              <input 
                type="text" 
                value={details.collegeId} 
                onChange={e => setDetails({...details, collegeId: e.target.value})} 
                className={`w-full bg-gray-50 border rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium ${errors.collegeId ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="19IT101" 
              />
              {errors.collegeId && <p className="text-xs text-red-500 ml-1">{errors.collegeId}</p>}
            </div>
            <div className="space-y-1">
              <label className="text-xs text-secondary uppercase font-bold ml-1">Phone Number</label>
              <input 
                type="text" 
                value={details.phone} 
                onChange={handlePhoneChange} 
                className={`w-full bg-gray-50 border rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium ${errors.phone ? 'border-red-500' : 'border-gray-200'}`} 
                placeholder="9876543210" 
                maxLength={10}
              />
              {errors.phone && <p className="text-xs text-red-500 ml-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs text-secondary uppercase font-bold ml-1">Delivery Address</label>
              {details.address ? (
                <div className="border border-green-200 bg-green-50 p-4 rounded-xl flex items-start justify-between">
                  <div className="flex gap-3">
                     <div className="bg-white p-2 rounded-full h-fit text-green-600 shadow-sm"><MapPin size={20} /></div>
                     <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold bg-white px-2 py-0.5 rounded text-primary border border-gray-200 uppercase">{addressForm.type}</span>
                          <span className="text-sm font-bold text-primary">Deliver Here</span>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed max-w-lg">{details.address}</p>
                     </div>
                  </div>
                  <button 
                    onClick={() => setIsAddressModalOpen(true)}
                    className="text-xs font-bold text-primary bg-white px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50"
                  >
                    CHANGE
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddressModalOpen(true)}
                  className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-all group ${errors.address ? 'border-red-300 bg-red-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}`}
                >
                  <div className="bg-primary text-white p-3 rounded-full group-hover:scale-110 transition-transform">
                     <Plus size={24} />
                  </div>
                  <span className="text-sm font-bold text-primary">Add New Address</span>
                </button>
              )}
              {errors.address && <p className="text-xs text-red-500 ml-1">{errors.address}</p>}
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <button onClick={handleNext} className="bg-primary hover:bg-gray-800 text-white font-bold py-3.5 px-10 rounded-xl transition-colors shadow-lg shadow-gray-200">
              Continue to Payment
            </button>
          </div>
        </div>
      )}

      {/* Address Selection Modal */}
      <Modal isOpen={isAddressModalOpen} onClose={() => setIsAddressModalOpen(false)} title={details.address ? "Edit Address" : "Add New Address"}>
        <div className="space-y-4">
           {/* Country & State */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
                 <select 
                   value={addressForm.country} 
                   onChange={(e) => setAddressForm({...addressForm, country: e.target.value, state: '', city: ''})}
                   className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-medium focus:border-primary outline-none"
                 >
                    {LOCATIONS.countries.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                 <select 
                   value={addressForm.state} 
                   onChange={(e) => setAddressForm({...addressForm, state: e.target.value, city: ''})}
                   className={`w-full bg-gray-50 border rounded-lg p-3 text-sm font-medium focus:border-primary outline-none ${errors.state ? 'border-red-500' : 'border-gray-200'}`}
                   disabled={!addressForm.country}
                 >
                    <option value="">Select State</option>
                    {(LOCATIONS.states[addressForm.country as keyof typeof LOCATIONS.states] || []).map(s => (
                       <option key={s} value={s}>{s}</option>
                    ))}
                 </select>
                 {errors.state && <p className="text-[10px] text-red-500">{errors.state}</p>}
              </div>
           </div>

           {/* City & Pincode */}
           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                 <select 
                   value={addressForm.city} 
                   onChange={(e) => setAddressForm({...addressForm, city: e.target.value, roadName: ''})}
                   className={`w-full bg-gray-50 border rounded-lg p-3 text-sm font-medium focus:border-primary outline-none ${errors.city ? 'border-red-500' : 'border-gray-200'}`}
                   disabled={!addressForm.state}
                 >
                    <option value="">Select City</option>
                    {(LOCATIONS.cities[addressForm.state as keyof typeof LOCATIONS.cities] || []).map(c => (
                       <option key={c} value={c}>{c}</option>
                    ))}
                 </select>
                 {errors.city && <p className="text-[10px] text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-1">
                 <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                 <input 
                   type="text" 
                   value={addressForm.pincode} 
                   onChange={(e) => setAddressForm({...addressForm, pincode: e.target.value.replace(/\D/g, '').slice(0, 6)})}
                   className={`w-full bg-gray-50 border rounded-lg p-3 text-sm font-medium focus:border-primary outline-none ${errors.pincode ? 'border-red-500' : 'border-gray-200'}`}
                   placeholder="636005"
                   maxLength={6}
                 />
                 {errors.pincode && <p className="text-[10px] text-red-500">{errors.pincode}</p>}
              </div>
           </div>

           {/* Detailed Address */}
           <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">House No., Building Name</label>
              <input 
                type="text" 
                value={addressForm.houseNo} 
                onChange={(e) => setAddressForm({...addressForm, houseNo: e.target.value})}
                className={`w-full bg-gray-50 border rounded-lg p-3 text-sm font-medium focus:border-primary outline-none ${errors.houseNo ? 'border-red-500' : 'border-gray-200'}`}
                placeholder="Room 304, Kaveri Hostel"
              />
              {errors.houseNo && <p className="text-[10px] text-red-500">{errors.houseNo}</p>}
           </div>
           
           <div className="space-y-1 relative" ref={suggestionRef}>
              <label className="text-xs font-bold text-gray-500 uppercase">Road Name, Area, Colony</label>
              <div className="relative">
                 <MapPin size={16} className="absolute left-3 top-3.5 text-gray-400" />
                 <input 
                   type="text" 
                   value={addressForm.roadName} 
                   onChange={handleRoadNameChange}
                   onFocus={() => addressForm.roadName && setShowSuggestions(true)}
                   className={`w-full bg-gray-50 border rounded-lg p-3 pl-10 text-sm font-medium focus:border-primary outline-none ${errors.roadName ? 'border-red-500' : 'border-gray-200'}`}
                   placeholder="Start typing to search..."
                   autoComplete="off"
                 />
              </div>
              {errors.roadName && <p className="text-[10px] text-red-500">{errors.roadName}</p>}
              
              {/* Autocomplete Dropdown */}
              {showSuggestions && roadSuggestions.length > 0 && (
                 <ul className="absolute z-50 w-full bg-white border border-gray-100 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto animate-in fade-in slide-in-from-top-1">
                    {roadSuggestions.map((suggestion, idx) => (
                       <li 
                         key={idx} 
                         onClick={() => selectSuggestion(suggestion)}
                         className="px-4 py-2.5 text-sm hover:bg-gray-50 cursor-pointer flex items-center gap-2 text-primary"
                       >
                          <MapPin size={14} className="text-gray-400" />
                          {suggestion}
                       </li>
                    ))}
                 </ul>
              )}
           </div>

           {/* Address Type */}
           <div className="pt-2">
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Address Type</label>
              <div className="flex gap-3">
                 {['Home', 'Work', 'Other'].map((type) => (
                    <button 
                       key={type}
                       onClick={() => setAddressForm({...addressForm, type: type as any})}
                       className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${addressForm.type === type ? 'bg-primary text-white border-primary' : 'bg-white text-secondary border-gray-200 hover:border-gray-300'}`}
                    >
                       {type}
                    </button>
                 ))}
              </div>
           </div>

           <button 
             onClick={handleSaveAddress}
             className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md mt-4"
           >
             Save Address
           </button>
        </div>
      </Modal>

      {/* Step 2: Payment Simulation */}
      {step === 2 && (
        <div className="bg-surface p-10 rounded-3xl border border-gray-200 shadow-card animate-in fade-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-primary mb-8">Payment Method</h2>
          <div className="bg-gray-50 p-8 rounded-2xl border border-gray-200 mb-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-secondary font-medium">Order Total</span>
              <span className="text-3xl font-bold text-primary">₹{totalAmount}</span>
            </div>
            <div className="h-px bg-gray-200 my-6"></div>
            <p className="text-xs text-secondary/70 mb-3 font-bold uppercase tracking-wider">Payment Options</p>
            <div className="flex items-center gap-4 p-4 bg-white border border-primary rounded-xl shadow-sm">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-primary text-sm font-bold">Pay on Delivery / Collection</span>
            </div>
            <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl mt-4 opacity-50 cursor-not-allowed">
              <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
              <span className="text-gray-400 text-sm font-medium">UPI / Online Payment (Coming Soon)</span>
            </div>
          </div>
          <div className="flex justify-between">
            <button onClick={() => setStep(1)} className="text-secondary hover:text-primary font-bold">Back</button>
            <button onClick={handleNext} className="bg-primary hover:bg-gray-800 text-white font-bold py-3.5 px-10 rounded-xl transition-colors shadow-lg shadow-gray-200">
              Review Order
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-surface p-10 rounded-3xl border border-gray-200 shadow-card animate-in fade-in slide-in-from-right-4">
          <h2 className="text-2xl font-bold text-primary mb-8">Order Summary</h2>
          <div className="space-y-4 mb-10">
            {checkoutItems.map((item, idx) => (
              <div key={idx} className="flex gap-6 items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <img src={item.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-primary font-bold">{item.name}</h4>
                  <p className="text-xs text-secondary mt-1 font-medium">{item.category}</p>
                </div>
                <div className="text-primary font-bold text-lg">₹{item.pricePerDay}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center border-t border-gray-100 pt-6 mb-10">
            <span className="text-lg text-secondary font-medium">Total Payable</span>
            <span className="text-4xl font-bold text-primary">₹{totalAmount}</span>
          </div>

          <div className="flex justify-between items-center">
            <button onClick={() => setStep(2)} className="text-secondary hover:text-primary font-bold" disabled={loading}>Back</button>
            <button onClick={handleNext} disabled={loading} className="bg-primary hover:bg-gray-800 text-white font-bold py-3.5 px-10 rounded-xl transition-colors flex items-center gap-3 shadow-lg shadow-gray-200">
              {loading ? 'Processing...' : 'Confirm Prebooking'}
              {!loading && <Check size={20} />}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Professional Downloadable E-Bill */}
      {step === 4 && orderResult && (
        <>
          <div id="receipt-container" className="bg-white p-0 rounded-none md:rounded-3xl shadow-none md:shadow-2xl animate-in zoom-in-95 duration-500 max-w-2xl mx-auto overflow-hidden text-primary">
             {/* Header */}
             <div className="bg-primary text-white p-8 md:p-10 relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-start">
                   <div>
                      <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl font-bold text-2xl mb-4 border border-white/20">IC</div>
                      <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
                      <p className="text-white/60 text-sm mt-1">Official Club Receipt</p>
                   </div>
                   <div className="text-right">
                      <p className="text-white/80 font-mono font-medium text-lg">{orderResult.id}</p>
                      <p className="text-white/60 text-sm">Issued: {new Date().toLocaleDateString()}</p>
                      <div className="mt-2 inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold border border-green-500/30 uppercase tracking-wider">
                         Status: {orderResult.status}
                      </div>
                   </div>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
             </div>

             <div className="p-8 md:p-10 space-y-8">
                {/* Addresses */}
                <div className="flex justify-between gap-8 border-b border-gray-100 pb-8">
                   <div className="flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
                      <h3 className="font-bold text-lg">{orderResult.userName}</h3>
                      <p className="text-sm text-secondary">{orderResult.collegeId}</p>
                      <p className="text-sm text-secondary">{orderResult.userEmail}</p>
                      <p className="text-sm text-secondary mt-1 max-w-[200px]">{orderResult.address}</p>
                      <p className="text-sm text-secondary">{orderResult.contact}</p>
                   </div>
                   <div className="text-right flex-1">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Issued By</p>
                      <h3 className="font-bold text-lg">IC Club</h3>
                      <p className="text-sm text-secondary">Sona College of Technology</p>
                      <p className="text-sm text-secondary">Main Block, 2nd Floor</p>
                      <p className="text-sm text-secondary">Salem, TN - 636005</p>
                      <div className="flex items-center justify-end gap-1 text-sm text-secondary mt-1">
                         <Mail size={12} /> support@icclub.sona.edu
                      </div>
                   </div>
                </div>

                {/* Rental Details */}
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-800">Rental Items</h4>
                      <p className="text-xs text-secondary font-medium bg-gray-50 px-2 py-1 rounded">Return Due: <span className="text-red-500 font-bold">{returnDate.toLocaleDateString()}</span></p>
                   </div>
                   <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <table className="w-full text-sm text-left">
                         <thead className="bg-gray-50 text-xs text-secondary uppercase font-bold border-b border-gray-200">
                            <tr>
                               <th className="px-4 py-3">#</th>
                               <th className="px-4 py-3">Item Name</th>
                               <th className="px-4 py-3">Category</th>
                               <th className="px-4 py-3 text-right">Rate</th>
                            </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                            {orderResult.items.map((item: any, i: number) => (
                               <tr key={i}>
                                  <td className="px-4 py-3 text-secondary font-mono">{i + 1}</td>
                                  <td className="px-4 py-3 font-medium text-primary">{item.name}</td>
                                  <td className="px-4 py-3 text-secondary">{item.category}</td>
                                  <td className="px-4 py-3 text-right font-bold text-primary">₹{item.pricePerDay}</td>
                               </tr>
                            ))}
                         </tbody>
                      </table>
                   </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                   <div className="w-1/2 space-y-2">
                      <div className="flex justify-between text-sm text-secondary">
                         <span>Subtotal</span>
                         <span className="font-medium">₹{orderResult.totalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm text-secondary">
                         <span>Tax (0%)</span>
                         <span className="font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-gray-100 mt-2">
                         <span>Total Payable</span>
                         <span>₹{orderResult.totalAmount}</span>
                      </div>
                   </div>
                </div>

                {/* Footer / Legal */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-gray-100">
                   <div>
                      <h5 className="font-bold text-xs uppercase text-gray-400 mb-2">Terms & Conditions</h5>
                      <ul className="text-[10px] text-gray-500 space-y-1 list-disc list-inside">
                         <li>Items must be returned within 7 days.</li>
                         <li>User is liable for any physical damage.</li>
                         <li>Late returns incur ₹50/day fine.</li>
                         <li>This receipt serves as a gate pass.</li>
                      </ul>
                   </div>
                   <div className="flex flex-col items-end justify-between">
                      <div className="text-center group cursor-pointer" title="Scan to track order">
                         {/* Live Generated QR Code */}
                         <div className="w-20 h-20 bg-gray-50 p-1 rounded-lg border border-gray-100">
                            <img src={qrCodeApiUrl} alt="Order QR" className="w-full h-full mix-blend-multiply" />
                         </div>
                         <p className="text-[9px] text-gray-400 font-mono mt-1">{orderResult.id}</p>
                      </div>
                      <div className="mt-4 text-right">
                         <div className="h-px w-32 bg-gray-300 mb-1 ml-auto"></div>
                         <p className="text-[10px] text-gray-400 uppercase font-bold">Authorized Signatory</p>
                         <p className="font-signature text-2xl text-primary mt-1 pr-2 transform -rotate-2">Kanish</p>
                         <p className="text-[10px] text-primary font-bold">Senior Director</p>
                      </div>
                   </div>
                </div>
                
                <div className="text-center bg-gray-50 py-3 rounded-lg border border-dashed border-gray-200">
                   <p className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                      <ShieldCheck size={12} /> Verified by Sona College • IC Club Management System
                   </p>
                </div>
             </div>
          </div>

          <div className="mt-8 flex gap-4 max-w-2xl mx-auto no-print">
            <button onClick={() => navigate('/dashboard')} className="flex-1 bg-white border border-gray-200 text-primary py-3.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
              <Home size={18} /> Dashboard
            </button>
            <button onClick={handleDownloadInvoice} className="flex-1 bg-primary text-white py-3.5 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-200">
              <Download size={18} /> Download Invoice
            </button>
          </div>
        </>
      )}
    </div>
  );
};
