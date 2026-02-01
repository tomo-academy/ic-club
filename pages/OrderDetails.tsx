
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { ArrowLeft, Package, MapPin, Phone, HelpCircle, Check, Clock, Truck, Home, XCircle, Download, FileText, Mail, ShieldCheck, QrCode } from 'lucide-react';

export const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useApp();
  const navigate = useNavigate();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4 text-gray-400">
           <Package size={32} />
        </div>
        <h2 className="text-xl font-bold text-primary">Order Not Found</h2>
        <p className="text-secondary mt-2 mb-6">The order ID provided does not exist or has been removed.</p>
        <button onClick={() => navigate('/dashboard')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold">
           Go to Dashboard
        </button>
      </div>
    );
  }

  // QR Code URL
  const orderUrl = `${window.location.origin}/#/order/${order.id}`;
  const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(orderUrl)}&color=111827`;
  const returnDate = new Date(new Date(order.date).getTime() + 7 * 24 * 60 * 60 * 1000);

  // Helper to determine step status
  const getStepStatus = (stepName: string) => {
    const status = order.status;
    
    if (status === OrderStatus.REJECTED) return 'rejected';
    
    // Logic for Order Placed
    if (stepName === 'placed') return 'completed';
    
    // Logic for Approval
    if (stepName === 'approved') {
       if (status === OrderStatus.PENDING) return 'current';
       return 'completed';
    }
    
    // Logic for Picked Up / Delivered
    if (stepName === 'delivered') {
       if (status === OrderStatus.APPROVED) return 'pending'; // Waiting for pickup
       if (status === OrderStatus.DELIVERED || status === OrderStatus.RETURNED) return 'completed';
       return 'pending';
    }

    // Logic for Returned
    if (stepName === 'returned') {
       if (status === OrderStatus.RETURNED) return 'completed';
       if (status === OrderStatus.DELIVERED) return 'current'; // Currently rented
       return 'pending';
    }

    return 'pending';
  };

  const Step = ({ status, icon: Icon, label, date, isLast }: any) => {
    let colorClass = 'bg-gray-200 text-gray-400 border-gray-200';
    let lineColor = 'bg-gray-200';
    let icon = <Icon size={16} />;

    if (status === 'completed') {
      colorClass = 'bg-green-500 text-white border-green-500';
      lineColor = 'bg-green-500';
      icon = <Check size={16} />;
    } else if (status === 'current') {
      colorClass = 'bg-white border-2 border-green-500 text-green-500 animate-pulse';
      lineColor = 'bg-gray-200';
      icon = <Icon size={16} />;
    } else if (status === 'rejected') {
      colorClass = 'bg-red-500 text-white border-red-500';
      lineColor = 'bg-red-500';
      icon = <XCircle size={16} />;
    }

    return (
      <div className="flex-1 relative">
        <div className="flex flex-col items-center group">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors ${colorClass}`}>
            {icon}
          </div>
          <div className="mt-3 text-center">
            <p className={`text-xs font-bold uppercase tracking-wider ${status === 'pending' ? 'text-gray-400' : 'text-primary'}`}>{label}</p>
            {date && status === 'completed' && <p className="text-[10px] text-gray-500 mt-0.5">{date}</p>}
          </div>
        </div>
        {!isLast && (
           <div className={`absolute top-4 left-1/2 w-full h-1 -z-0 ${lineColor}`}></div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <style>
        {`
          @media print {
            body {
              background-color: white;
            }
            body > * {
              display: none !important;
            }
            #invoice-container, #invoice-container * {
              display: block !important;
              visibility: visible !important;
            }
            #invoice-container {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              background-color: white;
            }
            #invoice-container .flex {
              display: flex !important;
            }
            #invoice-container .grid {
              display: grid !important;
            }
            /* Reset text colors for print to ensure contrast */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          }
        `}
      </style>

      {/* Main Tracking UI */}
      <div className="tracking-ui">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
           <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-secondary">
                    <ArrowLeft size={20} />
                 </button>
                 <div>
                    <h1 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Order Details</h1>
                    <p className="text-sm font-bold text-primary">{order.id}</p>
                 </div>
              </div>
              {order.status === OrderStatus.APPROVED && (
                 <button onClick={() => setTimeout(() => window.print(), 100)} className="text-primary hover:text-accent font-bold text-sm flex items-center gap-1">
                    <Download size={16} /> <span className="hidden sm:inline">Invoice</span>
                 </button>
              )}
           </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
           {/* Order Status Card */}
           <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-lg font-bold text-primary">Track Order</h2>
                 {order.status === OrderStatus.REJECTED && (
                    <span className="text-xs font-bold bg-red-50 text-red-600 px-3 py-1 rounded-full border border-red-100">Order Rejected</span>
                 )}
              </div>
              
              <div className="flex w-full">
                 <Step status={getStepStatus('placed')} icon={FileText} label="Placed" date={new Date(order.date).toLocaleDateString()} />
                 <Step status={getStepStatus('approved')} icon={Check} label="Approved" />
                 <Step status={getStepStatus('delivered')} icon={Truck} label="Collected" />
                 <Step status={getStepStatus('returned')} icon={Home} label="Returned" isLast={true} />
              </div>
           </div>

           {/* Items Card */}
           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                 <h3 className="font-bold text-primary text-sm">Hardware Details</h3>
              </div>
              {order.items.map((item, idx) => (
                 <div key={idx} className="p-4 flex gap-4 border-b border-gray-100 last:border-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center p-2">
                       <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply" />
                    </div>
                    <div className="flex-1">
                       <h4 className="font-bold text-primary mb-1">{item.name}</h4>
                       <p className="text-xs text-gray-500 mb-2">{item.category}</p>
                       <div className="flex items-center gap-2">
                          <span className="font-bold text-primary">₹{item.pricePerDay}</span>
                          <span className="text-xs text-gray-400 line-through">₹{item.pricePerDay + 20}</span>
                          <span className="text-xs text-green-600 font-bold">Student Rate</span>
                       </div>
                    </div>
                 </div>
              ))}
              <div className="p-4 bg-gray-50 flex justify-between items-center">
                 <span className="text-sm font-bold text-gray-500">Total Order Value</span>
                 <span className="text-xl font-bold text-primary">₹{order.totalAmount}</span>
              </div>
           </div>

           {/* Shipping & Student Info */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-primary text-sm mb-4 border-b border-gray-100 pb-2">Student Details</h3>
                 <div className="space-y-3">
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase">Name</p>
                       <p className="text-sm font-medium text-primary">{order.userName}</p>
                    </div>
                    <div>
                       <p className="text-xs text-gray-400 font-bold uppercase">College ID</p>
                       <p className="text-sm font-medium text-primary">{order.collegeId}</p>
                    </div>
                    <div className="flex items-start gap-2">
                       <Phone size={14} className="text-gray-400 mt-0.5" />
                       <div>
                          <p className="text-xs text-gray-400 font-bold uppercase">Phone</p>
                          <p className="text-sm font-medium text-primary">{order.contact}</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                 <h3 className="font-bold text-primary text-sm mb-4 border-b border-gray-100 pb-2">Delivery Location</h3>
                 <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                       <MapPin size={16} />
                    </div>
                    <div>
                       <p className="text-sm font-bold text-primary mb-1">Hostel / Dept Address</p>
                       <p className="text-sm text-secondary leading-relaxed">{order.address}</p>
                    </div>
                 </div>
              </div>
           </div>

           {/* Help Footer */}
           <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                 <HelpCircle size={20} className="text-secondary" />
                 <span className="text-sm font-medium text-primary">Need help with this order?</span>
              </div>
              <button onClick={() => navigate('/live-chat')} className="text-sm font-bold text-primary hover:underline">
                 Chat with Admin
              </button>
           </div>
        </div>
      </div>

      {/* Hidden Invoice Template for Printing */}
      <div id="invoice-container" className="hidden">
        <div className="bg-white p-10 max-w-3xl mx-auto border border-gray-200">
          <div className="bg-primary text-white p-8 md:p-10 relative overflow-hidden rounded-3xl mb-8">
              <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl font-bold text-2xl mb-4 border border-white/20">IC</div>
                    <h1 className="text-3xl font-bold tracking-tight">INVOICE</h1>
                    <p className="text-white/60 text-sm mt-1">Official Club Receipt</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/80 font-mono font-medium text-lg">{order.id}</p>
                    <p className="text-white/60 text-sm">Issued: {new Date(order.date).toLocaleDateString()}</p>
                    <div className="mt-2 inline-block px-3 py-1 bg-green-500/20 text-green-300 rounded text-xs font-bold border border-green-500/30 uppercase tracking-wider">
                        Status: {order.status}
                    </div>
                  </div>
              </div>
          </div>

          <div className="p-4 space-y-8">
              <div className="flex justify-between gap-8 border-b border-gray-100 pb-8">
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Billed To</p>
                    <h3 className="font-bold text-lg">{order.userName}</h3>
                    <p className="text-sm text-secondary">{order.collegeId}</p>
                    <p className="text-sm text-secondary">{order.userEmail}</p>
                    <p className="text-sm text-secondary mt-1 max-w-[200px]">{order.address}</p>
                    <p className="text-sm text-secondary">{order.contact}</p>
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
                          {order.items.map((item: any, i: number) => (
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

              <div className="flex justify-end">
                  <div className="w-1/2 space-y-2">
                    <div className="flex justify-between text-sm text-secondary">
                        <span>Subtotal</span>
                        <span className="font-medium">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-sm text-secondary">
                        <span>Tax (0%)</span>
                        <span className="font-medium">₹0.00</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-primary pt-2 border-t border-gray-100 mt-2">
                        <span>Total Payable</span>
                        <span>₹{order.totalAmount}</span>
                    </div>
                  </div>
              </div>

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
                    <div className="text-center group cursor-pointer">
                        <div className="w-20 h-20 bg-gray-50 p-1 rounded-lg border border-gray-100">
                          <img src={qrCodeApiUrl} alt="Order QR" className="w-full h-full mix-blend-multiply" />
                        </div>
                        <p className="text-[9px] text-gray-400 font-mono mt-1">{order.id}</p>
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
      </div>
    </div>
  );
};
