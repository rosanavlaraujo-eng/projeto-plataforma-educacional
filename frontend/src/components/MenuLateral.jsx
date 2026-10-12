
import { Link, NavLink } from 'react-router-dom'
import {
  House,
  FilePlus,
  ScanLine,
  ChartColumn,
  History,
  LogOut,
  UserRound
} from 'lucide-react'

function MenuLateral() {
  return (
    <aside className="painel-lateral">
      <Link to="/" className="painel-logo">
        🎓 Questio
      </Link>

      <nav className="painel-menu">
        <NavLink
          to="/painel"
          end
          className={({ isActive }) =>
            isActive ? 'menu-ativo' : ''
          }
        >
          <House size={20} /> Início
        </NavLink>

        <a href="/painel#provas">
          <FilePlus size={20} /> Provas
        </a>

        <a href="/painel#correcoes">
          <ScanLine size={20} /> Correções
        </a>

        <a href="/painel#resultados">
          <ChartColumn size={20} /> Resultados
        </a>

        <a href="/painel#historico">
          <History size={20} /> Histórico
        </a>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            isActive ? 'menu-ativo' : ''
          }
        >
          <UserRound size={20} /> Meu perfil
        </NavLink>
      </nav>

      <Link to="/" className="painel-sair">
        <LogOut size={20} /> Sair
      </Link>
    </aside>
  )
}

export default MenuLateral
