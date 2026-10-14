
import { Link } from 'react-router-dom'
import { UserRound, ArrowLeft } from 'lucide-react'

import MenuLateral from '../components/MenuLateral'

import '../style pages/Perfil.css'
import '../style pages/Painel.css'

function Perfil() {
  return (
    <div className="pagina-painel">

      {/* MENU LATERAL */}
      <MenuLateral />

      {/* CONTEÚDO DO PERFIL */}
      <main className="painel-conteudo">

        <div className="perfil-container">

          {/* BOTÃO VOLTAR */}
          <Link to="/painel" className="perfil-voltar">
            <ArrowLeft size={18} />
            Voltar ao painel
          </Link>

          {/* TÍTULO */}
          <div className="perfil-titulo">
            <h1>Meu perfil</h1>
            <p>Gerencie suas informações pessoais.</p>
          </div>

          {/* CARTÃO DO PERFIL */}
          <div className="perfil-card">

            <div className="perfil-usuario">
              <div className="perfil-avatar">
                <UserRound size={30} />
              </div>

              <div>
                <h2>Professor(a)</h2>
                <span>Conta gratuita</span>
              </div>
            </div>

            {/* INFORMAÇÕES DO PROFESSOR */}
            <div className="perfil-campos">

              <label htmlFor="perfil-nome">
                Nome completo
              </label>

              <input
                id="perfil-nome"
                type="text"
                value="Nome do professor"
                readOnly
              />

              <label htmlFor="perfil-email">
                E-mail
              </label>

              <input
                id="perfil-email"
                type="email"
                value="professor@exemplo.com"
                readOnly
              />

            </div>

            {/* BOTÃO DE EDIÇÃO */}
            <button
              className="perfil-botao"
              type="button"
              disabled
            >
              Editar perfil (em breve)
            </button>

          </div>
        </div>
      </main>
    </div>
  )
}

export default Perfil
