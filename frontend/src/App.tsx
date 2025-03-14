import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CreateSpacePage from './pages/dashboard/CreateSpacePage';
import SpaceDetailPage from './pages/dashboard/SpaceDetailPage';
import SubmitTestimonialPage from './pages/testimonial/SubmitTestimonialPage';
import UserContext, { UserDataContext } from './context/UserContext';


// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout with Navbar and Footer
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

// Layout without Footer (for auth pages)
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
    </div>
  );
};

// App component with routing
const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><SignupPage /></AuthLayout>} />
        <Route path="/submit/:id" element={<SubmitTestimonialPage />} />
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <MainLayout><DashboardPage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/create-space" element={
          <ProtectedRoute>
            <MainLayout><CreateSpacePage /></MainLayout>
          </ProtectedRoute>
        } />
        <Route path="/dashboard/space/:id" element={
          <ProtectedRoute>
            <MainLayout><SpaceDetailPage /></MainLayout>
          </ProtectedRoute>
        } />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <UserContext>
      
        <AppContent />
      
    </UserContext>
  );
}

export default App;