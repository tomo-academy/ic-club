
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, ArrowLeft, Zap, CheckSquare, Square } from 'lucide-react';
import { Toast } from '../components/Toast';

export const Cart: React.FC = () => {
  const { cart, removeFromCart, removeBatchFromCart } = useApp();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showToast, setShowToast] = useState(false);

  // Initialize selection when cart loads (select all by default for better UX)
  useEffect(() => {
    if (cart.length > 0 && selectedItems.length === 0) {
        setSelectedItems(cart.map(i => i.id));
    }
  }, [cart.length]);

  const toggleSelect = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cart.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.map(i => i.id));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Remove ${selectedItems.length} items from cart?`)) {
      removeBatchFromCart(selectedItems);
      setSelectedItems([]);
      setShowToast(true);
    }
  };

  const checkoutItems = cart.filter(item => selectedItems.includes(item.id));
  const totalAmount = checkoutItems.reduce((sum, item) => sum + item.pricePerDay, 0);

  const handlePlaceOrder = () => {
      if (checkoutItems.length === 0) return;
      navigate('/booking', { state: { selectedItemIds: selectedItems } });
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-surface rounded-3xl border border-gray-200 shadow-sm text-center max-w-4xl mx-auto">
        <div className="w-48 h-48 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-300 relative">
             <ShoppingBag size={80} />
        </div>
        <h2 className="text-2xl font-bold text-primary">Your Cart is Empty</h2>
        <p className="text-secondary mt-2 mb-8 max-w-xs mx-auto">It looks like you haven't added any hardware components yet.</p>
        <button 
            onClick={() => navigate('/hardware')} 
            className="bg-primary text-white px-10 py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center gap-2"
        >
            Start Shopping <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      {showToast && <Toast message="Items removed from cart" type="success" onClose={() => setShowToast(false)} />}
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
            <button onClick={() => navigate('/hardware')} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-secondary">
                <ArrowLeft size={20} />
            </button>
            <h1 className="text-3xl font-bold text-primary">My Cart ({cart.length})</h1>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Cart Items List */}
        <div className="flex-1 w-full space-y-4">
            
            {/* Bulk Actions Header */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={toggleSelectAll} className="flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors">
                        {selectedItems.length === cart.length && cart.length > 0 ? (
                             <CheckSquare size={20} className="text-primary" />
                        ) : (
                             <Square size={20} className="text-gray-300" />
                        )}
                        Select All
                    </button>
                </div>
                {selectedItems.length > 0 && (
                    <button onClick={handleBulkDelete} className="text-sm font-bold text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                        <Trash2 size={16} /> Delete Selected ({selectedItems.length})
                    </button>
                )}
            </div>

            {cart.map((item) => {
                const isSelected = selectedItems.includes(item.id);
                return (
                    <div key={item.id} className={`bg-surface p-6 rounded-3xl border shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-md transition-all relative overflow-hidden group ${isSelected ? 'border-blue-500 bg-blue-50/20' : 'border-gray-200 opacity-90'}`}>
                        {/* Checkbox */}
                        <div className="absolute top-4 left-4 z-10">
                            <button onClick={() => toggleSelect(item.id)} className="bg-white rounded hover:scale-110 transition-transform">
                                {isSelected ? (
                                    <CheckSquare size={24} className="text-blue-600 fill-white" />
                                ) : (
                                    <Square size={24} className="text-gray-300 fill-white" />
                                )}
                            </button>
                        </div>

                        {/* Item Image */}
                        <div className="w-full sm:w-40 h-40 bg-gray-50 rounded-2xl flex-shrink-0 p-4 border border-gray-100 flex items-center justify-center ml-6 sm:ml-0">
                            <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between py-1">
                            <div>
                                <div className="flex justify-between items-start">
                                    <div className="pr-8">
                                        <h3 className="text-xl font-bold text-primary mb-1 cursor-pointer hover:text-accent transition-colors" onClick={() => navigate(`/hardware/${item.id}`)}>{item.name}</h3>
                                        <p className="text-sm text-secondary font-medium bg-gray-100 inline-block px-2 py-1 rounded-md mb-2">{item.category}</p>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-4">Seller: IC Club Inventory</p>
                                
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold text-primary">₹{item.pricePerDay}</span>
                                    <span className="text-xs text-secondary font-medium">/ day</span>
                                    <span className="text-xs text-green-600 font-bold ml-2 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">In Stock</span>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-6 pt-4 border-t border-gray-100">
                                <button 
                                    onClick={() => removeFromCart(item.id)}
                                    className="text-sm font-bold text-gray-500 hover:text-red-500 transition-colors flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg"
                                >
                                    <Trash2 size={16} /> REMOVE
                                </button>
                                <div className="h-4 w-px bg-gray-200 mx-1"></div>
                                <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded-lg">
                                    <Zap size={16} /> SAVE FOR LATER
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })}
            
            <button onClick={() => navigate('/hardware')} className="w-full py-4 bg-white border border-gray-200 border-dashed rounded-2xl text-secondary font-bold hover:text-primary hover:border-primary hover:bg-gray-50 transition-all flex items-center justify-center gap-2 shadow-sm">
                <ArrowLeft size={18} /> Continue Shopping
            </button>
        </div>

        {/* Price Details Sidebar */}
        <div className="lg:w-96 w-full sticky top-24">
            <div className="bg-surface rounded-3xl border border-gray-200 shadow-card p-6">
                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Price Details</h3>
                
                <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-secondary font-medium text-sm">
                        <span>Price ({checkoutItems.length} items)</span>
                        <span className="text-primary">₹{totalAmount}</span>
                    </div>
                    <div className="flex justify-between text-secondary font-medium text-sm">
                        <span>Discount</span>
                        <span className="text-green-600">− ₹0</span>
                    </div>
                    <div className="flex justify-between text-secondary font-medium text-sm">
                        <span>Delivery Charges</span>
                        <span className="text-green-600">Free</span>
                    </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-dashed border-gray-200 mb-6 bg-gray-50/50 -mx-6 px-6">
                    <span className="text-lg font-bold text-primary">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">₹{totalAmount}</span>
                </div>

                <button 
                    onClick={handlePlaceOrder}
                    disabled={checkoutItems.length === 0}
                    className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Place Order <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="mt-6 flex items-start gap-3 text-xs text-gray-400 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <ShieldCheck size={16} className="flex-shrink-0 text-gray-400" />
                    <p>Safe and secure payments. 100% Authentic products verified by Club Admin.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};
