
import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { OrderStatus, ProblemStatement, HardwareItem, User } from '../types';
import { CheckCircle, XCircle, Truck, Package, FilePlus, Calendar, Plus, Edit2, Trash2, Search, Settings, Users, MapPin, X, History, ShoppingBag } from 'lucide-react';
import { Toast, ToastType } from '../components/Toast';
import { Modal } from '../components/Modal';
import L from 'leaflet';

// Real Coordinates for Cities (Lat, Lng)
const REAL_CITY_COORDS: Record<string, [number, number]> = {
  'Salem': [11.6643, 78.1460],
  'Chennai': [13.0827, 80.2707],
  'Bangalore': [12.9716, 77.5946],
  'Coimbatore': [11.0168, 76.9558],
  'Madurai': [9.9252, 78.1198],
  'Trichy': [10.7905, 78.7047],
  'Hyderabad': [17.3850, 78.4867],
  'Mumbai': [19.0760, 72.8777],
  'Delhi': [28.7041, 77.1025],
};

// Interactive Leaflet Map Component
const LeafletMap = ({ users }: { users: User[] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Initialize map centered on South India
      const map = L.map(mapContainerRef.current, {
         zoomControl: false,
         attributionControl: false
      }).setView([11.5, 78.5], 7); // Center roughly around Salem/TN

      // Add a nice, clean tile layer (CartoDB Voyager)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);
      
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  useEffect(() => {
     if (!mapInstanceRef.current) return;

     const map = mapInstanceRef.current;
     
     // Clear existing markers
     map.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
           map.removeLayer(layer);
        }
     });

     // Calculate user density per city
     const cityCounts: Record<string, number> = {};
     users.forEach(u => {
        const city = u.city || 'Salem';
        cityCounts[city] = (cityCounts[city] || 0) + 1;
     });

     // Add markers
     Object.entries(cityCounts).forEach(([city, count]) => {
        const coords = REAL_CITY_COORDS[city] || REAL_CITY_COORDS['Salem'];
        
        // Custom HTML Icon for a pulsating effect
        const iconHtml = `
          <div class="relative flex items-center justify-center w-8 h-8">
             <div class="absolute w-full h-full bg-accent/40 rounded-full animate-ping"></div>
             <div class="relative w-8 h-8 bg-white border-2 border-accent rounded-full flex items-center justify-center text-primary font-bold text-xs shadow-md">
                ${count}
             </div>
          </div>
        `;

        const customIcon = L.divIcon({
           className: 'custom-map-marker',
           html: iconHtml,
           iconSize: [32, 32],
           iconAnchor: [16, 16]
        });

        const marker = L.marker(coords, { icon: customIcon }).addTo(map);
        
        // Custom popup
        const popupContent = `
           <div class="p-1 font-sans text-center">
              <h3 class="font-bold text-gray-800 text-sm">${city}</h3>
              <p class="text-xs text-gray-500">${count} Student${count > 1 ? 's' : ''}</p>
           </div>
        `;
        marker.bindPopup(popupContent);
     });

  }, [users]);

  return (
    <div className="relative w-full h-[450px] rounded-3xl overflow-hidden shadow-card border border-gray-200 z-0">
      <div ref={mapContainerRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-gray-100 shadow-sm z-[400]">
         <h4 className="font-bold text-primary text-sm flex items-center gap-2">
            <MapPin size={16} className="text-accent" /> Live Student Distribution
         </h4>
      </div>
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  const { 
    orders, updateOrderStatus, 
    problemStatements, addProblemStatement, updateProblemStatement, deleteProblemStatement,
    hardware, addHardware, updateHardware, deleteHardware, 
    allUsers 
  } = useApp();
  const [activeTab, setActiveTab] = useState<'orders' | 'problems' | 'inventory' | 'users'>('orders');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Problem Form State
  const [problemTitle, setProblemTitle] = useState('');
  const [problemDesc, setProblemDesc] = useState('');
  const [problemDate, setProblemDate] = useState('');
  const [editingProblem, setEditingProblem] = useState<ProblemStatement | null>(null);

  // User History State
  const [selectedUserForHistory, setSelectedUserForHistory] = useState<User | null>(null);

  // Hardware Management State
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<HardwareItem | null>(null);
  const [hardwareForm, setHardwareForm] = useState({
    name: '',
    category: 'Microcontrollers',
    pricePerDay: 0,
    stock: 1,
    description: '',
    image: '',
    available: true
  });
  const [hardwareSearch, setHardwareSearch] = useState('');

  // Reset problem form when tab changes
  useEffect(() => {
    if (activeTab !== 'problems') {
        setEditingProblem(null);
        setProblemTitle('');
        setProblemDesc('');
        setProblemDate('');
    }
  }, [activeTab]);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  const handleStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status);
    showToast(`Order status updated to ${status}`, 'success');
  };

  const handleProblemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProblem) {
       updateProblemStatement({
          ...editingProblem,
          title: problemTitle,
          description: problemDesc,
          deadline: problemDate
       });
       showToast('Problem Statement Updated Successfully!', 'success');
       setEditingProblem(null);
    } else {
       const newProblem: ProblemStatement = {
         id: Date.now().toString(),
         title: problemTitle,
         description: problemDesc,
         deadline: problemDate
       };
       addProblemStatement(newProblem);
       showToast('Problem Statement Published Successfully!', 'success');
    }
    
    setProblemTitle('');
    setProblemDesc('');
    setProblemDate('');
  };

  const handleEditProblem = (problem: ProblemStatement) => {
     setEditingProblem(problem);
     setProblemTitle(problem.title);
     setProblemDesc(problem.description);
     setProblemDate(problem.deadline);
  };

  const handleCancelProblemEdit = () => {
     setEditingProblem(null);
     setProblemTitle('');
     setProblemDesc('');
     setProblemDate('');
  };

  const handleDeleteProblem = (id: string) => {
     if(window.confirm("Are you sure you want to delete this problem statement?")) {
        deleteProblemStatement(id);
        showToast('Problem Statement Deleted', 'info');
        if (editingProblem?.id === id) {
           handleCancelProblemEdit();
        }
     }
  };

  // Hardware Logic
  const openAddHardwareModal = () => {
    setEditingItem(null);
    setHardwareForm({
      name: '',
      category: 'Microcontrollers',
      pricePerDay: 0,
      stock: 1,
      description: '',
      image: 'https://picsum.photos/400/300?random=' + Math.floor(Math.random() * 100),
      available: true
    });
    setIsHardwareModalOpen(true);
  };

  const openEditHardwareModal = (item: HardwareItem) => {
    setEditingItem(item);
    setHardwareForm({
      name: item.name,
      category: item.category,
      pricePerDay: item.pricePerDay,
      stock: item.stock,
      description: item.description,
      image: item.image,
      available: item.available
    });
    setIsHardwareModalOpen(true);
  };

  const handleHardwareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingItem) {
      // Update existing
      updateHardware({
        ...editingItem,
        ...hardwareForm,
        pricePerDay: Number(hardwareForm.pricePerDay),
        stock: Number(hardwareForm.stock)
      });
      showToast('Hardware updated successfully', 'success');
    } else {
      // Add new
      addHardware({
        ...hardwareForm,
        pricePerDay: Number(hardwareForm.pricePerDay),
        stock: Number(hardwareForm.stock)
      });
      showToast('New hardware added to inventory', 'success');
    }
    setIsHardwareModalOpen(false);
  };

  const handleDeleteHardware = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteHardware(id);
      showToast('Item deleted from inventory', 'info');
    }
  };

  // Filter hardware for inventory tab
  const filteredHardware = hardware.filter(h => 
    h.name.toLowerCase().includes(hardwareSearch.toLowerCase()) || 
    h.category.toLowerCase().includes(hardwareSearch.toLowerCase())
  );

  // Get User History
  const getUserHistory = (userId: string) => {
    return orders.filter(o => o.userId === userId).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <div className="space-y-10">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h1 className="text-3xl font-bold text-primary tracking-tight">Admin Dashboard</h1>
        <div className="flex bg-surface p-1.5 rounded-xl border border-gray-200 shadow-sm overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-gray-50'}`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'inventory' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-gray-50'}`}
          >
            Inventory
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'users' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-gray-50'}`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('problems')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'problems' ? 'bg-primary text-white shadow-md' : 'text-secondary hover:text-primary hover:bg-gray-50'}`}
          >
            Problem Statements
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-surface rounded-3xl border border-gray-200 overflow-hidden shadow-card animate-in fade-in duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-8 py-5 font-bold">Order ID</th>
                  <th className="px-8 py-5 font-bold">Student</th>
                  <th className="px-8 py-5 font-bold">Items</th>
                  <th className="px-8 py-5 font-bold">Status</th>
                  <th className="px-8 py-5 font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {orders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-8 py-5 text-primary font-bold text-sm">{order.id}</td>
                    <td className="px-8 py-5">
                      <div className="text-sm text-primary font-bold">{order.userName}</div>
                      <div className="text-xs text-secondary font-medium">{order.collegeId}</div>
                    </td>
                    <td className="px-8 py-5 text-sm text-secondary">{order.items.map(i => i.name).join(', ')}</td>
                    <td className="px-8 py-5">
                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border
                        ${order.status === OrderStatus.APPROVED ? 'bg-green-50 text-green-600 border-green-100' : 
                          order.status === OrderStatus.PENDING ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                          order.status === OrderStatus.DELIVERED ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          order.status === OrderStatus.REJECTED ? 'bg-red-50 text-red-600 border-red-100' :
                          'bg-gray-100 text-gray-500 border-gray-200'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-8 py-5 flex gap-3">
                      {order.status === OrderStatus.PENDING && (
                        <>
                          <button onClick={() => handleStatusChange(order.id, OrderStatus.APPROVED)} className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors border border-green-100" title="Approve">
                            <CheckCircle size={18} />
                          </button>
                          <button onClick={() => handleStatusChange(order.id, OrderStatus.REJECTED)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors border border-red-100" title="Reject">
                            <XCircle size={18} />
                          </button>
                        </>
                      )}
                      {order.status === OrderStatus.APPROVED && (
                        <button onClick={() => handleStatusChange(order.id, OrderStatus.DELIVERED)} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2 text-xs px-3 font-bold border border-blue-100" title="Mark Delivered">
                          <Truck size={16} /> Deliver
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                   <tr>
                     <td colSpan={5} className="text-center py-12 text-secondary font-medium">No active bookings found.</td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="flex flex-col lg:flex-row gap-8">
             {/* Map Card */}
             <div className="flex-1">
                <LeafletMap users={allUsers} />
             </div>
             
             {/* Stats Card */}
             <div className="lg:w-1/3 bg-surface rounded-3xl border border-gray-200 p-8 shadow-sm flex flex-col justify-center">
                <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                   <Users size={20} /> User Stats
                </h3>
                <div className="space-y-6">
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-secondary text-xs uppercase tracking-wider font-bold">Total Students</span>
                      <div className="text-3xl font-bold text-primary mt-1">{allUsers.length}</div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-secondary text-xs uppercase tracking-wider font-bold">New This Month</span>
                      <div className="text-3xl font-bold text-green-600 mt-1 flex items-center gap-2">
                         3 <span className="text-xs bg-green-100 px-2 py-0.5 rounded-full text-green-700">+12%</span>
                      </div>
                   </div>
                   <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <span className="text-secondary text-xs uppercase tracking-wider font-bold">Top Location</span>
                      <div className="text-3xl font-bold text-accent mt-1">Salem</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-surface rounded-3xl border border-gray-200 overflow-hidden shadow-card">
            <div className="p-6 border-b border-gray-100">
               <h3 className="text-lg font-bold text-primary">Student Directory</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-secondary text-xs uppercase tracking-wider">
                  <tr>
                    <th className="px-8 py-5 font-bold">Name / ID</th>
                    <th className="px-8 py-5 font-bold">Role</th>
                    <th className="px-8 py-5 font-bold">Location</th>
                    <th className="px-8 py-5 font-bold">Join Date</th>
                    <th className="px-8 py-5 font-bold text-right">Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allUsers.map(u => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {u.name.charAt(0)}
                           </div>
                           <div>
                              <div className="text-sm text-primary font-bold">{u.name}</div>
                              <div className="text-xs text-secondary font-medium">{u.email}</div>
                              {u.rollNumber && <div className="text-[10px] text-gray-400 font-mono mt-0.5">{u.rollNumber}</div>}
                           </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${u.role === 'ADMIN' ? 'bg-purple-50 text-accent border-purple-100' : 'bg-gray-100 text-secondary border-gray-200'}`}>
                           {u.role}
                         </span>
                      </td>
                      <td className="px-8 py-5">
                         <div className="flex items-center gap-2 text-sm text-secondary">
                            <MapPin size={14} className="text-gray-400" />
                            {u.city || 'Unknown'}
                         </div>
                      </td>
                      <td className="px-8 py-5 text-sm text-secondary font-medium">
                         {u.joinDate ? new Date(u.joinDate).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-8 py-5 text-right">
                         <button 
                            onClick={() => setSelectedUserForHistory(u)}
                            className="text-xs font-bold text-primary hover:text-accent transition-colors flex items-center gap-1 ml-auto"
                         >
                            <History size={14} /> View History
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={hardwareSearch}
                onChange={(e) => setHardwareSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary shadow-sm"
              />
            </div>
            <button 
              onClick={openAddHardwareModal}
              className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200"
            >
              <Plus size={20} /> Add Item
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHardware.map(item => (
              <div key={item.id} className="bg-surface rounded-3xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-card transition-shadow flex flex-col">
                <div className="relative h-40 bg-gray-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 right-3 flex gap-2">
                     <button onClick={() => openEditHardwareModal(item)} className="p-2 bg-white/90 rounded-full hover:bg-white text-primary shadow-sm backdrop-blur-sm">
                       <Edit2 size={14} />
                     </button>
                     <button onClick={() => handleDeleteHardware(item.id)} className="p-2 bg-white/90 rounded-full hover:bg-red-50 text-red-500 shadow-sm backdrop-blur-sm">
                       <Trash2 size={14} />
                     </button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-primary">{item.name}</h3>
                    <span className="text-xs bg-gray-50 px-2 py-1 rounded text-secondary font-bold">{item.category}</span>
                  </div>
                  <p className="text-secondary text-xs line-clamp-2 mb-4">{item.description}</p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-xs text-secondary block">Stock</span>
                      <span className="font-bold text-primary">{item.stock}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-secondary block">Price</span>
                      <span className="font-bold text-primary">₹{item.pricePerDay}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'problems' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in fade-in duration-300">
           {/* Form */}
           <div className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-card h-fit sticky top-24">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                   {editingProblem ? <Edit2 size={24} className="text-accent" /> : <FilePlus size={24} className="text-primary" />}
                   {editingProblem ? 'Edit Statement' : 'Add Statement'}
                 </h2>
                 {editingProblem && (
                    <button onClick={handleCancelProblemEdit} className="p-1 hover:bg-gray-100 rounded-full">
                       <X size={20} className="text-gray-400" />
                    </button>
                 )}
              </div>
              
              <form onSubmit={handleProblemSubmit} className="space-y-5">
                 <div>
                    <label className="text-xs text-secondary uppercase font-bold mb-2 block">Title</label>
                    <input type="text" required value={problemTitle} onChange={e => setProblemTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium" />
                 </div>
                 <div>
                    <label className="text-xs text-secondary uppercase font-bold mb-2 block">Deadline</label>
                    <input type="date" required value={problemDate} onChange={e => setProblemDate(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium" />
                 </div>
                 <div>
                    <label className="text-xs text-secondary uppercase font-bold mb-2 block">Description</label>
                    <textarea required rows={4} value={problemDesc} onChange={e => setProblemDesc(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-primary focus:border-primary outline-none font-medium" />
                 </div>
                 <div className="flex gap-2">
                    {editingProblem && (
                       <button type="button" onClick={handleCancelProblemEdit} className="flex-1 bg-gray-100 hover:bg-gray-200 text-primary font-bold py-3.5 rounded-xl transition-colors">Cancel</button>
                    )}
                    <button type="submit" className="flex-1 bg-primary hover:bg-gray-800 text-white font-bold py-3.5 rounded-xl transition-colors shadow-lg shadow-gray-200">
                       {editingProblem ? 'Update' : 'Publish'}
                    </button>
                 </div>
              </form>
           </div>

           {/* List */}
           <div className="lg:col-span-2 space-y-6">
             <h2 className="text-xl font-bold text-primary">Active Statements</h2>
             {problemStatements.map(problem => (
               <div key={problem.id} className="bg-surface p-8 rounded-3xl border border-gray-200 shadow-sm flex flex-col gap-4 relative group">
                 <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                       onClick={() => handleEditProblem(problem)}
                       className="p-2 bg-white border border-gray-200 rounded-lg hover:border-primary text-secondary hover:text-primary shadow-sm"
                    >
                       <Edit2 size={16} />
                    </button>
                    <button 
                       onClick={() => handleDeleteProblem(problem.id)}
                       className="p-2 bg-white border border-gray-200 rounded-lg hover:border-red-500 text-secondary hover:text-red-500 shadow-sm"
                    >
                       <Trash2 size={16} />
                    </button>
                 </div>
                 
                 <div className="flex justify-between items-start">
                   <h3 className="text-2xl font-bold text-primary pr-20">{problem.title}</h3>
                   <span className="text-xs font-bold text-accent border border-purple-100 px-3 py-1.5 rounded-full bg-purple-50 flex items-center gap-2 flex-shrink-0">
                     <Calendar size={14} /> {problem.deadline}
                   </span>
                 </div>
                 <p className="text-secondary leading-relaxed whitespace-pre-wrap">{problem.description}</p>
                 <div className="mt-2 pt-4 border-t border-gray-100 flex justify-end">
                    <span className="text-xs text-secondary font-medium bg-gray-50 px-3 py-1 rounded-full">Visible to students</span>
                 </div>
               </div>
             ))}
             
             {problemStatements.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
                   <p className="text-gray-400 font-bold">No problem statements found.</p>
                </div>
             )}
           </div>
        </div>
      )}

      {/* Hardware Modal */}
      <Modal 
        isOpen={isHardwareModalOpen} 
        onClose={() => setIsHardwareModalOpen(false)} 
        title={editingItem ? "Edit Hardware Item" : "Add New Hardware"}
      >
        <form onSubmit={handleHardwareSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Item Name</label>
                <input required type="text" value={hardwareForm.name} onChange={e => setHardwareForm({...hardwareForm, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium" />
             </div>
             <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Category</label>
                <select value={hardwareForm.category} onChange={e => setHardwareForm({...hardwareForm, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium cursor-pointer">
                   <option>Microcontrollers</option>
                   <option>Single Board Computers</option>
                   <option>Sensors</option>
                   <option>Motors</option>
                   <option>Robotics</option>
                   <option>Displays</option>
                   <option>Tools</option>
                </select>
             </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Price (₹/Day)</label>
                <input required type="number" min="0" value={hardwareForm.pricePerDay} onChange={e => setHardwareForm({...hardwareForm, pricePerDay: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium" />
             </div>
             <div>
                <label className="text-xs text-secondary uppercase font-bold mb-2 block">Stock Quantity</label>
                <input required type="number" min="0" value={hardwareForm.stock} onChange={e => setHardwareForm({...hardwareForm, stock: Number(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium" />
             </div>
          </div>

          <div>
             <label className="text-xs text-secondary uppercase font-bold mb-2 block">Image URL</label>
             <input type="text" value={hardwareForm.image} onChange={e => setHardwareForm({...hardwareForm, image: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium" placeholder="https://..." />
          </div>

          <div>
             <label className="text-xs text-secondary uppercase font-bold mb-2 block">Description</label>
             <textarea required rows={3} value={hardwareForm.description} onChange={e => setHardwareForm({...hardwareForm, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-primary focus:border-primary outline-none font-medium" />
          </div>

          <div className="flex items-center gap-2 pt-2">
             <input type="checkbox" id="available" checked={hardwareForm.available} onChange={e => setHardwareForm({...hardwareForm, available: e.target.checked})} className="w-5 h-5 rounded text-primary focus:ring-primary border-gray-300" />
             <label htmlFor="available" className="text-sm font-bold text-primary cursor-pointer">Available for Rent</label>
          </div>

          <button type="submit" className="w-full bg-primary hover:bg-gray-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-gray-200 mt-4">
             {editingItem ? 'Update Item' : 'Add Item'}
          </button>
        </form>
      </Modal>

      {/* User History Modal */}
      {selectedUserForHistory && (
        <Modal 
          isOpen={!!selectedUserForHistory} 
          onClose={() => setSelectedUserForHistory(null)} 
          title="User Activity History"
        >
           <div className="space-y-6">
              {/* User Summary Header */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                 <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center font-bold text-2xl">
                    {selectedUserForHistory.name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-bold text-primary text-lg">{selectedUserForHistory.name}</h3>
                    <p className="text-sm text-secondary">{selectedUserForHistory.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-secondary">{selectedUserForHistory.rollNumber || 'No ID'}</span>
                       <span className="text-xs bg-white border border-gray-200 px-2 py-0.5 rounded text-secondary">{selectedUserForHistory.city || 'Unknown Location'}</span>
                    </div>
                 </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-blue-50 p-4 rounded-xl text-center">
                    <p className="text-blue-600 text-xs font-bold uppercase">Total Orders</p>
                    <p className="text-2xl font-bold text-primary mt-1">{getUserHistory(selectedUserForHistory.id).length}</p>
                 </div>
                 <div className="bg-green-50 p-4 rounded-xl text-center">
                    <p className="text-green-600 text-xs font-bold uppercase">Active Rentals</p>
                    <p className="text-2xl font-bold text-primary mt-1">
                       {getUserHistory(selectedUserForHistory.id).filter(o => o.status === OrderStatus.APPROVED || o.status === OrderStatus.DELIVERED).length}
                    </p>
                 </div>
              </div>

              {/* History Timeline/List */}
              <div>
                 <h4 className="font-bold text-primary mb-3 flex items-center gap-2">
                    <History size={16} /> Order Timeline
                 </h4>
                 <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {getUserHistory(selectedUserForHistory.id).length > 0 ? (
                       getUserHistory(selectedUserForHistory.id).map(order => (
                          <div key={order.id} className="border border-gray-100 rounded-xl p-3 hover:bg-gray-50 transition-colors">
                             <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-mono text-gray-400">#{order.id}</span>
                                <span className="text-xs font-bold text-secondary">{new Date(order.date).toLocaleDateString()}</span>
                             </div>
                             <div className="flex gap-3 items-center mb-2">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                   <ShoppingBag size={14} className="text-secondary" />
                                </div>
                                <div className="flex-1">
                                   <p className="text-sm font-bold text-primary line-clamp-1">{order.items.map(i => i.name).join(', ')}</p>
                                   <p className="text-xs text-secondary">Total: ₹{order.totalAmount}</p>
                                </div>
                             </div>
                             <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100 border-dashed">
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                   order.status === 'APPROVED' || order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                                   order.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                   'bg-yellow-100 text-yellow-700'
                                }`}>
                                   {order.status}
                                </span>
                                <span className="text-[10px] text-gray-400">Updated: {new Date(order.date).toLocaleTimeString()}</span>
                             </div>
                          </div>
                       ))
                    ) : (
                       <div className="text-center py-8 text-gray-400">
                          <p className="text-sm">No activity recorded for this user.</p>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </Modal>
      )}
    </div>
  );
};
