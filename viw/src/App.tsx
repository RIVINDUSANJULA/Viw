import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Projects from "./pages/Projects";
import './App.css'
import ProjectBoard from './pages/ProjectBoard';
import NotFound from "./pages/notFound";

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Projects />}/>
      <Route path='/projects/:id' element={<ProjectBoard/>}/>
      <Route path="*" element={<NotFound/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
