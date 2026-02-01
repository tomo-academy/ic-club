import React, { PropsWithChildren } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { Dashboard } from './pages/Dashboard';
import { HardwareList } from './pages/HardwareList';
import { HardwareDetails } from './pages/HardwareDetails';
import { BookingFlow } from './pages/BookingFlow';
import { AdminDashboard } from './pages/AdminDashboard';
import { Community } from './pages/Community';
import { ProblemStatements } from './pages/ProblemStatements';
import { UserProfile } from './pages/UserProfile';
import { MyOrders } from './pages/MyOrders';
import { Cart } from './pages/Cart';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Support } from './pages/Support';
import { UserGuide } from './pages/UserGuide';
import { ReportIssue } from './pages/ReportIssue';
import { LiveChat } from './pages/LiveChat';
import { OrderDetails } from './pages/OrderDetails';
import { UserRole } from './types';

const ProtectedRoute = ({ children, role }: PropsWithChildren<{ role?: UserRole }>) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/" />;
  if (role && user.role !== role) return <Navigate to="/dashboard" />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/support" element={<Support />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute role={UserRole.USER}>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/hardware" element={
          <ProtectedRoute role={UserRole.USER}>
            <HardwareList />
          </ProtectedRoute>
        } />
        
        <Route path="/hardware/:id" element={
          <ProtectedRoute role={UserRole.USER}>
            <HardwareDetails />
          </ProtectedRoute>
        } />

        <Route path="/cart" element={
          <ProtectedRoute role={UserRole.USER}>
            <Cart />
          </ProtectedRoute>
        } />

        <Route path="/booking" element={
          <ProtectedRoute role={UserRole.USER}>
            <BookingFlow />
          </ProtectedRoute>
        } />
        
        <Route path="/community" element={
          <ProtectedRoute role={UserRole.USER}>
            <Community />
          </ProtectedRoute>
        } />
        
        <Route path="/problem-statements" element={
          <ProtectedRoute role={UserRole.USER}>
            <ProblemStatements />
          </ProtectedRoute>
        } />
        
        <Route path="/profile" element={
          <ProtectedRoute role={UserRole.USER}>
            <UserProfile />
          </ProtectedRoute>
        } />

        <Route path="/my-orders" element={
          <ProtectedRoute role={UserRole.USER}>
            <MyOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/order/:orderId" element={<OrderDetails />} />

        <Route path="/user-guide" element={<UserGuide />} />
        <Route path="/report-issue" element={<ReportIssue />} />
        <Route path="/live-chat" element={<LiveChat />} />

        <Route path="/admin" element={
          <ProtectedRoute role={UserRole.ADMIN}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <AppProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AppProvider>
  );
}