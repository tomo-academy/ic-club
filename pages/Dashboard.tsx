import React from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus } from '../types';
import { Link } from 'react-router-dom';
import { Package, Clock, CheckCircle, AlertCircle, Plus, ArrowRight } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, orders } = useApp();
  
  const myOrders = orders.filter(o => o.userId === user?.id);
  const activeRentals = myOrders.filter(o => o.status === OrderStatus.APPROVED || o.status === OrderStatus.DELIVERED);
  const pendingRequests = myOrders.filter(o => o.status === OrderStatus.PENDING);

  return (
    <div className="space-y-10">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">Hello, {user?.name.split(' ')[0]} 👋</h1>
          <p className="text-secondary mt-2 text-lg">Welcome to your innovation hub.</p>
        </div>
        <Link to="/community" className="flex items-center gap-2 bg-primary hover:bg-gray-800 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-bold shadow-md shadow-gray-200">
          <Plus size={18} />
          Create Post
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface p-6 rounded-3xl border border-gray-200 shadow-card hover:shadow-soft transition-shadow group cursor-pointer">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-gray-50 rounded-2xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
              <Package size={24} />
            </div>
            <span className="text-3xl font-bold text-primary">{myOrders.length}</span>
          </div>
          <h3 className="text-secondary font-medium">Total Orders</h3>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-gray-200 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Clock size={24} />
            </div>
            <span className="text-3xl font-bold text-primary">{activeRentals.length}</span>
          </div>
          <h3 className="text-secondary font-medium">Active Rentals</h3>
        </div>

        <div className="bg-surface p-6 rounded-3xl border border-gray-200 shadow-card hover:shadow-soft transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-50 rounded-2xl text-yellow-600">
              <AlertCircle size={24} />
            </div>
            <span className="text-3xl font-bold text-primary">{pendingRequests.length}</span>
          </div>
          <h3 className="text-secondary font-medium">Pending Approval</h3>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Rentals List */}
        <div className="bg-surface rounded-3xl border border-gray-200 overflow-hidden shadow-card">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Active Hardware</h2>
            <Link to="/hardware" className="text-sm text-accent hover:text-violet-700 font-bold transition-colors">Rent New</Link>
          </div>
          <div className="p-8">
            {activeRentals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-secondary text-sm">No active rentals currently.</p>
                <Link to="/hardware" className="mt-4 inline-block text-primary text-sm font-bold border-b border-primary hover:text-accent hover:border-accent transition-all">Browse Catalog</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {activeRentals.slice(0, 3).map(order => (
                  <div key={order.id} className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <img src={order.items[0].image} alt="" className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="text-primary font-bold text-sm">{order.items[0].name}</h4>
                      <p className="text-xs text-secondary mt-1">Due: {new Date(new Date(order.date).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                    </div>
                    <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-bold border border-green-100">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Orders Preview */}
        <div className="bg-surface rounded-3xl border border-gray-200 overflow-hidden shadow-card flex flex-col">
          <div className="p-8 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Recent Activity</h2>
            <Link to="/my-orders" className="text-sm text-secondary hover:text-primary font-bold transition-colors flex items-center gap-1">
               View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 font-bold">Item</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {myOrders.slice(0, 4).map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                        <div className="text-primary text-sm font-bold">{order.items[0].name}</div>
                        {order.items.length > 1 && <div className="text-xs text-secondary">+{order.items.length - 1} more</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border
                        ${order.status === OrderStatus.APPROVED ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.status === OrderStatus.PENDING ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                          'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary text-sm font-medium text-right">{new Date(order.date).toLocaleDateString()}</td>
                  </tr>
                ))}
                {myOrders.length === 0 && (
                   <tr>
                     <td colSpan={3} className="text-center py-10 text-secondary text-sm">No recent activity.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
          {myOrders.length > 0 && (
            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
               <Link to="/my-orders" className="w-full block text-center text-sm font-bold text-primary py-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
                 See Full Order History
               </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};