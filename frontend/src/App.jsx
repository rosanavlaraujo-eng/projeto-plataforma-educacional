
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from "./pages/Painel";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";
import Planos from "./pages/Planos";
import TesteAnuncios from "./pages/TesteAnuncios";
import Questoes from "./pages/Questoes";
import Correcoes from "./pages/Correcoes";
import Resultados from "./pages/Resultados";
import Historico from "./pages/Historico";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        <Route path="/painel" element={<Painel />} />
        <Route path="/provas" element={<Questoes />} />
        <Route path="/correcoes" element={<Correcoes />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/historico" element={<Historico />} />

        <Route path="/perfil" element={<Perfil />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/teste-anuncios" element={<TesteAnuncios />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
