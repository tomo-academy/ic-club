import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { Search, Filter, Package, Calendar, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export const MyOrders: React.FC = () => {
  const { user, orders } = useApp();
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const myOrders = orders.filter(o => o.userId === user?.id).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const filteredOrders = myOrders.filter(order => {
    // Tab filtering
    if (activeTab === 'active' && !(order.status === OrderStatus.APPROVED || order.status === OrderStatus.DELIVERED || order.status === OrderStatus.PENDING)) return false;
    if (activeTab === 'completed' && !(order.status === OrderStatus.RETURNED || order.status === OrderStatus.REJECTED)) return false;
    
    // Search filtering
    const searchLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchLower) ||
      order.items.some(i => i.name.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-primary">My Orders</h1>
           <p className="text-secondary mt-1">Track and manage your hardware rentals.</p>
        </div>
        
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-surface border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium focus:outline-none focus:border-primary shadow-sm w-full md:w-64"
            />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('all')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-1 ${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
        >
          All Orders ({myOrders.length})
        </button>
        <button 
          onClick={() => setActiveTab('active')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-1 ${activeTab === 'active' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
        >
          Active Rentals ({myOrders.filter(o => o.status === OrderStatus.APPROVED || o.status === OrderStatus.DELIVERED || o.status === OrderStatus.PENDING).length})
        </button>
        <button 
          onClick={() => setActiveTab('completed')}
          className={`pb-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap px-1 ${activeTab === 'completed' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary'}`}
        >
          History
        </button>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-3xl border border-gray-200">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-secondary">
               <Package size={32} />
             </div>
             <h3 className="text-lg font-bold text-primary">No orders found</h3>
             <p className="text-secondary text-sm mt-1">Try changing the filter or search term.</p>
             {activeTab === 'all' && myOrders.length === 0 && (
                <Link to="/hardware" className="mt-4 inline-block bg-primary text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-gray-200 hover:bg-gray-800 transition-all">
                   Browse Catalog
                </Link>
             )}
          </div>
        ) : (
          filteredOrders.map(order => (
            <div key={order.id} className="bg-surface rounded-3xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-100 pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-secondary bg-gray-50 px-2 py-1 rounded border border-gray-100">{order.id}</span>
                  <span className="text-secondary text-sm flex items-center gap-1">
                    <Calendar size={14} /> {new Date(order.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-primary font-bold">Total: ₹{order.totalAmount}</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                        ${order.status === OrderStatus.APPROVED ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.status === OrderStatus.PENDING ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                          order.status === OrderStatus.DELIVERED ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          order.status === OrderStatus.REJECTED ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {order.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                 {order.items.map((item, idx) => (
                   <div key={idx} className="flex gap-4 items-center">
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-100" />
                      <div>
                         <h4 className="font-bold text-primary">{item.name}</h4>
                         <p className="text-xs text-secondary">{item.category} • ₹{item.pricePerDay}/day</p>
                      </div>
                   </div>
                 ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                 <div className="flex items-center gap-2 text-sm text-secondary">
                    <MapPin size={16} />
                    <span>Delivering to: <span className="font-medium text-primary">{order.address || 'N/A'}</span></span>
                 </div>
                 {/* Actions placeholder - could be used for 'Return Item' or 'Download Invoice' later */}
                 <button className="text-sm font-bold text-primary hover:text-accent transition-colors">
                    Download Invoice
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};