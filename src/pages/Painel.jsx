import { useNavigate } from 'react-router-dom' // Importado para navegação sem alterar variáveis
import {
  FilePlus,
  ScanLine,
  ChartColumn,
  History
} from 'lucide-react'

import MenuLateral from '../components/MenuLateral'
import '../style/Painel.css'

function Painel() {
  const navigate = useNavigate(); // Hook do React Router para redirecionar

  return (
    <div className="pagina-painel">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* CONTEÚDO PRINCIPAL */}
      <main className="painel-conteudo" id="inicio">

        <div className="painel-boas-vindas">
          <h1>Olá, professor(a)! 👋</h1>
          <p>O que vamos fazer hoje?</p>
        </div>

        {/* CARTÕES DO PAINEL */}
        <div className="painel-cartoes">

          {/* Cartão com evento onClick adicionado e estilo de cursor pointer */}
          <div 
            className="painel-cartao" 
            id="provas" 
            onClick={() => navigate('/questoes')} 
            style={{ cursor: 'pointer' }}
          >
            <FilePlus size={32} />
            <h3>Criar prova</h3>
            <p>Monte e organize suas avaliações.</p>
          </div>

          <div className="painel-cartao" id="correcoes">
            <ScanLine size={32} />
            <h3>Corrigir gabaritos</h3>
            <p>Corrija as respostas dos alunos.</p>
          </div>

          <div className="painel-cartao" id="resultados">
            <ChartColumn size={32} />
            <h3>Resultados</h3>
            <p>Acompanhe o desempenho da turma.</p>
          </div>

          <div className="painel-cartao" id="historico">
            <History size={32} />
            <h3>Histórico</h3>
            <p>Consulte suas avaliações anteriores.</p>
          </div>

        </div>
      </main>
    </div>
  )
}

export default Painel