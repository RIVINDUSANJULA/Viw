import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Projects from "./pages/Projects";
import './App.css'
import ProjectBoard from './pages/ProjectBoard';
import NotFound from "./pages/notFound";
import { TenantProvider } from './context/TenantContext';
import AppLayout from './components/layout/AppLayout';

function App() {

  return (
    <TenantProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/projects" replace />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/board" element={<ProjectBoard />} />
            <Route path="*" element={<NotFound/>} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
      
    </TenantProvider>
  )
}

export default App
