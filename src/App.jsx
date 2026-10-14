
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Painel from './pages/Painel'
import Perfil from './pages/Perfil'
import Questoes from './pages/Questoes'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/questoes" element={<Questoes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
