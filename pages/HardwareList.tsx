import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { Search, ShoppingBag } from 'lucide-react';

export const HardwareList: React.FC = () => {
  const { hardware, addToCart } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const navigate = useNavigate();

  const categories = ['All', ...Array.from(new Set(hardware.map(h => h.category)))];

  const filteredItems = hardware.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  const handlePrebook = (e: React.MouseEvent, item: any) => {
    e.stopPropagation(); // Prevent card click
    addToCart(item);
    navigate('/cart'); // Direct to cart for review
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-primary tracking-tight">Hardware Inventory</h1>
          <p className="text-secondary mt-2 text-lg">Rent high-quality components for your projects.</p>
        </div>
        
        {/* Search & Filter */}
        <div className="flex flex-wrap gap-4 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
            <input
              type="text"
              placeholder="Search components..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 bg-surface border border-gray-200 text-primary rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-gray-400 font-medium shadow-sm"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-surface border border-gray-200 text-primary rounded-xl px-6 py-3 focus:outline-none focus:border-primary cursor-pointer font-medium shadow-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredItems.map(item => (
          <div 
            key={item.id} 
            onClick={() => navigate(`/hardware/${item.id}`)}
            className="bg-surface border border-gray-200 rounded-3xl overflow-hidden hover:shadow-lg transition-all group flex flex-col shadow-card cursor-pointer"
          >
            <div className="relative h-56 overflow-hidden bg-gray-50">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              {!item.available && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center backdrop-blur-sm">
                  <span className="bg-red-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">Out of Stock</span>
                </div>
              )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <span className="text-xs font-bold text-accent uppercase tracking-wider bg-purple-50 px-2 py-1 rounded-md">{item.category}</span>
                {item.available && <span className="text-xs text-green-600 font-bold flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">Available</span>}
              </div>
              <h3 className="text-lg font-bold text-primary mb-2 leading-tight group-hover:text-accent transition-colors">{item.name}</h3>
              <p className="text-secondary text-sm line-clamp-2 mb-6 flex-1">{item.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-6 border-t border-gray-100">
                <div className="flex flex-col">
                  <span className="text-xs text-secondary font-medium">Price/Day</span>
                  <span className="text-xl font-bold text-primary">₹{item.pricePerDay}</span>
                </div>
                <button
                  onClick={(e) => handlePrebook(e, item)}
                  disabled={!item.available}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all
                    ${item.available 
                      ? 'bg-primary hover:bg-gray-800 text-white shadow-lg shadow-gray-200' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'}`}
                >
                  <ShoppingBag size={16} />
                  Prebook
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredItems.length === 0 && (
         <div className="text-center py-20">
             <p className="text-secondary text-lg">No hardware found matching your search.</p>
         </div>
      )}
    </div>
  );
};