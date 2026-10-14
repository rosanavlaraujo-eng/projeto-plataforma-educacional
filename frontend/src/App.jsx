
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from "./pages/Painel";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Planos from "./pages/Planos";
import TesteAnuncios from "./pages/TesteAnuncios";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/painel" element={<Painel />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/planos" element={<Planos />} />
        <Route
          path="/teste-anuncios"
          element={<TesteAnuncios />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
