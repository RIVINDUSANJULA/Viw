import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
// import Projects from "./pages/Projects";
import './App.css'
import ProjectBoard from './pages/ProjectBoard';
import NotFound from "./pages/notFound";
import { TenantProvider, useTenant } from './context/TenantContext';
// import AppLayout from './components/layout/AppLayout';
import AuthProvider, { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const { activeTenant, isLoading: tenantLoading } = useTenant();
  
  if (loading || tenantLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;
  if (!activeTenant) return <Navigate to="/register" replace />;
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (user) return <Navigate to="/projects" replace />;

  return <>{children}</>;
}

export default function App() {


  return (
    <AuthProvider>
      <TenantProvider>
        <BrowserRouter>
          <Routes>

            <Route path="/" element={<Navigate to="/projects" replace />} />

            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            
            <Route path="/projects" element={
              <ProtectedRoute>
                <Navigate to="/board" replace />
              </ProtectedRoute>
            } />
            
            <Route path="/board" element={
              <ProtectedRoute>
                <ProjectBoard />
              </ProtectedRoute>
            } />

            <Route path="*" element={<NotFound />} />
            
          </Routes>
        </BrowserRouter>
      </TenantProvider>
    </AuthProvider>
  )
}

