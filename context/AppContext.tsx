
import React, { createContext, useContext, useState, useEffect, ReactNode, PropsWithChildren } from 'react';
import { User, UserRole, HardwareItem, Order, Post, Reply, ProblemStatement, OrderStatus } from '../types';
import { MOCK_HARDWARE, INITIAL_POSTS, INITIAL_PROBLEMS } from '../constants';

// Mock Data for Users
const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Rahul Kumar', email: 'rahul@sona.edu', role: UserRole.USER, city: 'Salem', joinDate: '2023-09-15', rollNumber: '21IT101', department: 'IT', year: '3rd Year' },
  { id: 'u2', name: 'Priya Sharma', email: 'priya@sona.edu', role: UserRole.USER, city: 'Chennai', joinDate: '2023-09-02', rollNumber: '21CS045', department: 'CSE', year: '3rd Year' },
  { id: 'u3', name: 'Arun Vijay', email: 'arun@sona.edu', role: UserRole.USER, city: 'Coimbatore', joinDate: '2023-10-10', rollNumber: '22ME012', department: 'Mech', year: '2nd Year' },
  { id: 'u4', name: 'Sneha Gupta', email: 'sneha@sona.edu', role: UserRole.USER, city: 'Bangalore', joinDate: '2023-11-05', rollNumber: '21EC088', department: 'ECE', year: '3rd Year' },
  { id: 'u5', name: 'Karthik Raja', email: 'karthik@sona.edu', role: UserRole.USER, city: 'Salem', joinDate: '2024-01-12', rollNumber: '22EE034', department: 'EEE', year: '2nd Year' },
  { id: 'u6', name: 'Divya M', email: 'divya@sona.edu', role: UserRole.USER, city: 'Madurai', joinDate: '2024-02-20', rollNumber: '21IT056', department: 'IT', year: '4th Year' },
  { id: 'u7', name: 'Sanjay B', email: 'sanjay@sona.edu', role: UserRole.USER, city: 'Salem', joinDate: '2024-03-01', rollNumber: '23CS102', department: 'CSE', year: '1st Year' },
];

interface AppContextType {
  user: User | null;
  allUsers: User[]; 
  login: (email: string, name: string, role: UserRole) => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  hardware: HardwareItem[];
  addHardware: (item: Omit<HardwareItem, 'id'>) => void;
  updateHardware: (item: HardwareItem) => void;
  deleteHardware: (id: string) => void;

  cart: HardwareItem[];
  addToCart: (item: HardwareItem) => void;
  removeFromCart: (itemId: string) => void;
  removeBatchFromCart: (itemIds: string[]) => void;
  clearCart: () => void;
  
  placeOrder: (details: any, itemsToOrder?: HardwareItem[]) => Promise<Order>;
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  
  posts: Post[];
  createPost: (content: string, image?: string) => void;
  replyToPost: (postId: string, content: string) => void;
  
  problemStatements: ProblemStatement[];
  addProblemStatement: (problem: ProblemStatement) => void;
  updateProblemStatement: (problem: ProblemStatement) => void;
  deleteProblemStatement: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: PropsWithChildren) => {
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('ic_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin View State
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);

  // Data State
  const [hardware, setHardware] = useState<HardwareItem[]>(() => {
    const saved = localStorage.getItem('ic_hardware');
    return saved ? JSON.parse(saved) : MOCK_HARDWARE;
  });
  
  const [cart, setCart] = useState<HardwareItem[]>(() => {
    const saved = localStorage.getItem('ic_cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [orders, setOrders] = useState<Order[]>(() => {
     const saved = localStorage.getItem('ic_orders');
     return saved ? JSON.parse(saved) : [];
  });
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  
  const [problemStatements, setProblemStatements] = useState<ProblemStatement[]>(() => {
    const saved = localStorage.getItem('ic_problems');
    return saved ? JSON.parse(saved) : INITIAL_PROBLEMS;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('ic_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('ic_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('ic_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('ic_hardware', JSON.stringify(hardware));
  }, [hardware]);

  useEffect(() => {
    localStorage.setItem('ic_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ic_problems', JSON.stringify(problemStatements));
  }, [problemStatements]);

  const login = (email: string, name: string, role: UserRole) => {
    const existingUser = allUsers.find(u => u.email === email);
    
    if (existingUser) {
        setUser(existingUser);
    } else {
        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          email,
          name,
          role,
          city: 'Salem', 
          joinDate: new Date().toISOString().split('T')[0],
          avatar: '',
          department: '',
          year: '',
          phone: '',
          rollNumber: ''
        };
        setUser(newUser);
        setAllUsers([...allUsers, newUser]);
    }
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  // Hardware Management
  const addHardware = (item: Omit<HardwareItem, 'id'>) => {
    const newItem: HardwareItem = {
      ...item,
      id: Date.now().toString(),
    };
    setHardware([...hardware, newItem]);
  };

  const updateHardware = (updatedItem: HardwareItem) => {
    setHardware(hardware.map(item => item.id === updatedItem.id ? updatedItem : item));
  };

  const deleteHardware = (id: string) => {
    setHardware(hardware.filter(item => item.id !== id));
  };

  const addToCart = (item: HardwareItem) => {
    if (!cart.find(i => i.id === item.id)) {
      setCart([...cart, item]);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(i => i.id !== itemId));
  };

  const removeBatchFromCart = (itemIds: string[]) => {
    const idSet = new Set(itemIds);
    setCart(cart.filter(i => !idSet.has(i.id)));
  };

  const clearCart = () => setCart([]);

  const placeOrder = async (details: any, itemsToOrder?: HardwareItem[]): Promise<Order> => {
    const finalItems = itemsToOrder || cart;
    return new Promise((resolve) => {
      setTimeout(() => {
        const newOrder: Order = {
          id: `ORD-${Math.floor(Math.random() * 10000)}`,
          userId: user?.id || 'guest',
          userName: details.fullName,
          userEmail: details.email,
          items: [...finalItems], 
          totalAmount: finalItems.reduce((sum, item) => sum + item.pricePerDay, 0),
          status: OrderStatus.PENDING,
          date: new Date().toISOString(),
          address: details.address,
          collegeId: details.collegeId,
          contact: details.phone
        };
        setOrders(prev => [newOrder, ...prev]);
        
        // Remove only ordered items from cart
        const orderedIds = new Set(finalItems.map(i => i.id));
        setCart(prev => prev.filter(i => !orderedIds.has(i.id)));
        
        resolve(newOrder);
      }, 1500); 
    });
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const createPost = (content: string, image?: string) => {
    const isAdmin = user?.role === UserRole.ADMIN;
    
    const newPost: Post = {
      id: Date.now().toString(),
      authorId: user?.id || 'anon',
      authorName: isAdmin ? 'IC Club Official' : user?.name || 'Anonymous',
      content,
      image,
      timestamp: new Date().toISOString(),
      likes: 0,
      replies: [],
      reposts: 0,
      isVerified: isAdmin
    };
    setPosts([newPost, ...posts]);
  };

  const replyToPost = (postId: string, content: string) => {
    const isAdmin = user?.role === UserRole.ADMIN;

    const newReply: Reply = {
      id: Date.now().toString(),
      authorId: user?.id || 'anon',
      authorName: isAdmin ? 'IC Club Official' : user?.name || 'Anonymous',
      content,
      timestamp: new Date().toISOString(),
      isVerified: isAdmin
    };

    setPosts(prevPosts => prevPosts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          replies: [...post.replies, newReply]
        };
      }
      return post;
    }));
  };

  const addProblemStatement = (problem: ProblemStatement) => {
    setProblemStatements([...problemStatements, problem]);
  };

  const updateProblemStatement = (problem: ProblemStatement) => {
    setProblemStatements(prev => prev.map(p => p.id === problem.id ? problem : p));
  };

  const deleteProblemStatement = (id: string) => {
    setProblemStatements(prev => prev.filter(p => p.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user, allUsers, login, logout, updateUserProfile,
      hardware, addHardware, updateHardware, deleteHardware,
      cart, addToCart, removeFromCart, removeBatchFromCart, clearCart,
      orders, placeOrder, updateOrderStatus,
      posts, createPost, replyToPost,
      problemStatements, addProblemStatement, updateProblemStatement, deleteProblemStatement
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
