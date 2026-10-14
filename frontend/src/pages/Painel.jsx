
import {
  FilePlus,
  ScanLine,
  ChartColumn,
  History,
  ArrowUpRight,
} from "lucide-react";

import { Link } from "react-router-dom";
import MenuLateral from "../components/MenuLateral";
import Anuncio from "../components/Anuncio";
import "../style pages/Painel.css";

function Painel() {
  const funcionalidades = [
    {
      titulo: "Criar prova",
      descricao: "Monte e organize suas avaliações.",
      icone: FilePlus,
      rota: "/provas",
      id: "provas",
    },
    {
      titulo: "Corrigir gabaritos",
      descricao: "Corrija as respostas dos alunos.",
      icone: ScanLine,
      rota: "/correcoes",
      id: "correcoes",
    },
    {
      titulo: "Resultados",
      descricao: "Acompanhe o desempenho da turma.",
      icone: ChartColumn,
      rota: "/resultados",
      id: "resultados",
    },
    {
      titulo: "Histórico",
      descricao: "Consulte suas avaliações anteriores.",
      icone: History,
      rota: "/historico",
      id: "historico",
    },
  ];

  return (
    <div className="pagina-painel">
      <MenuLateral />

      <main className="painel-conteudo" id="inicio">
        <div className="painel-boas-vindas">
          <h1>Olá, professor(a)! 👋</h1>
          <p>O que vamos fazer hoje?</p>
        </div>

        <div className="painel-cartoes">
          {funcionalidades.map((funcionalidade) => {
            const Icone = funcionalidade.icone;

            return (
              <Link
                to={funcionalidade.rota}
                className="painel-cartao painel-cartao-link"
                id={funcionalidade.id}
                key={funcionalidade.id}
              >
                <div className="painel-cartao-topo">
                  <Icone size={32} />
                  <ArrowUpRight size={20} />
                </div>

                <h3>{funcionalidade.titulo}</h3>
                <p>{funcionalidade.descricao}</p>
              </Link>
            );
          })}
        </div>

        <Anuncio plano="gratuito" />
      </main>
    </div>
  );
}

export default Painel;
