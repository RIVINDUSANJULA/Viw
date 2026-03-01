import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Projects from "./pages/Projects";
import './App.css'
import ProjectBoard from './pages/ProjectBoard';
import NotFound from "./pages/notFound";
import { TenantProvider } from './context/TenantContext';
import AppLayout from './components/layout/AppLayout';
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div >Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
}

export default function App() {

  return (
    <AuthProvider>
      <TenantProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Route */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes inside the Layout */}
            <Route path="/" element={
              <ProtectedRoute>
                <AppLayout>
                  <Navigate to="/projects" replace />
                </AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <AppLayout><Projects /></AppLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/board" element={
              <ProtectedRoute>
                <AppLayout><ProjectBoard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  )
}

