
import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import "../style components/MenuLateral.css";

import {
  House,
  FilePlus,
  ScanLine,
  ChartColumn,
  History,
  LogOut,
  UserRound,
  Settings,
  Crown,
  Menu,
  X,
} from "lucide-react";

export default function MenuLateral() {
  const [menuAberto, setMenuAberto] = useState(false);

  const classeLink = ({ isActive }) =>
    `painel-link ${isActive ? "ativo" : ""}`;

  function fecharMenu() {
    setMenuAberto(false);
  }

  return (
    <>
      {/* BARRA SUPERIOR DO CELULAR */}
      <header className="painel-barra-mobile">
        <h2>Questio</h2>

        <button
          type="button"
          className="painel-botao-menu"
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuAberto}
          aria-controls="questio-menu-lateral"
        >
          {menuAberto ? <X size={25} /> : <Menu size={25} />}
        </button>
      </header>

      {/* FUNDO ESCURO AO ABRIR O MENU NO CELULAR */}
      {menuAberto && (
        <button
          type="button"
          className="painel-menu-overlay"
          onClick={fecharMenu}
          aria-label="Fechar menu de navegação"
        />
      )}

      {/* MENU LATERAL */}
      <aside
        id="questio-menu-lateral"
        className={`painel-lateral ${menuAberto ? "menu-aberto" : ""}`}
      >
        <div className="painel-logo">
          <h2>Questio</h2>
          <p>Painel do Professor</p>
        </div>

        <nav className="painel-menu">
          <NavLink
            to="/painel"
            end
            className={classeLink}
            onClick={fecharMenu}
          >
            <House size={20} />
            <span>Início</span>
          </NavLink>

          <NavLink
            to="/provas"
            className={classeLink}
            onClick={fecharMenu}
          >
            <FilePlus size={20} />
            <span>Criar Prova</span>
          </NavLink>

          <NavLink
            to="/correcoes"
            className={classeLink}
            onClick={fecharMenu}
          >
            <ScanLine size={20} />
            <span>Corrigir Prova</span>
          </NavLink>

          <NavLink
            to="/resultados"
            className={classeLink}
            onClick={fecharMenu}
          >
            <ChartColumn size={20} />
            <span>Resultados</span>
          </NavLink>

          <NavLink
            to="/historico"
            className={classeLink}
            onClick={fecharMenu}
          >
            <History size={20} />
            <span>Histórico</span>
          </NavLink>

          <NavLink
            to="/perfil"
            className={classeLink}
            onClick={fecharMenu}
          >
            <UserRound size={20} />
            <span>Meu Perfil</span>
          </NavLink>

          <NavLink
            to="/planos"
            className={classeLink}
            onClick={fecharMenu}
          >
            <Crown size={20} />
            <span>Planos e Assinaturas</span>
          </NavLink>

          <NavLink
            to="/configuracoes"
            className={classeLink}
            onClick={fecharMenu}
          >
            <Settings size={20} />
            <span>Configurações</span>
          </NavLink>
        </nav>

        <div className="painel-sair">
          <Link
            to="/"
            className="painel-link"
            onClick={fecharMenu}
          >
            <LogOut size={20} />
            <span>Sair</span>
          </Link>
        </div>
      </aside>
    </>
  );
}
