
import { useEffect, useState } from "react";
import MenuLateral from "../components/MenuLateral";
import "../style pages/configuracoes.css";

export default function Configuracoes() {
  const [nome, setNome] = useState("Professor(a)");
  const [email, setEmail] = useState("professor@exemplo.com");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [tema, setTema] = useState(() => {
     return localStorage.getItem("questio-tema") || "claro";});
  const [notificacoes, setNotificacoes] = useState(true);
 const [mensagem, setMensagem] = useState("");

useEffect(() => {
  document.documentElement.setAttribute("data-theme", tema);
  localStorage.setItem("questio-tema", tema);
}, [tema]);

function salvarAlteracoes(evento) {
  evento.preventDefault();

    if (novaSenha || confirmarSenha || senhaAtual) {
      if (!senhaAtual) {
        setMensagem("Informe sua senha atual.");
        return;
      }

      if (novaSenha.length < 8) {
        setMensagem("A nova senha precisa ter pelo menos 8 caracteres.");
        return;
      }

      if (novaSenha !== confirmarSenha) {
        setMensagem("As novas senhas não coincidem.");
        return;
      }
    }

    setMensagem(
      "Configurações atualizadas nesta demonstração! A gravação definitiva será feita quando conectarmos o backend."
    );

    setSenhaAtual("");
    setNovaSenha("");
    setConfirmarSenha("");
  }

  return (
    <div className="configuracoes-layout">
      <MenuLateral />

      <main className="configuracoes-conteudo">
        <div className="configuracoes-cabecalho">
          <h1>Configurações</h1>
          <p>Gerencie seus dados e preferências da plataforma.</p>
        </div>

        <form onSubmit={salvarAlteracoes}>
          <section className="configuracoes-card">
            <h2>Minha conta</h2>
            <p>Atualize suas informações pessoais.</p>

            <div className="configuracoes-campo">
              <label htmlFor="config-nome">Nome completo</label>
              <input
                id="config-nome"
                type="text"
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                required
              />
            </div>

            <div className="configuracoes-campo">
              <label htmlFor="config-email">E-mail</label>
              <input
                id="config-email"
                type="email"
                value={email}
                onChange={(evento) => setEmail(evento.target.value)}
                required
              />
            </div>
          </section>

          <section className="configuracoes-card">
            <h2>Segurança</h2>
            <p>Preencha os campos somente se quiser alterar sua senha.</p>

            <div className="configuracoes-campo">
              <label htmlFor="config-senha-atual">Senha atual</label>
              <input
                id="config-senha-atual"
                type="password"
                value={senhaAtual}
                onChange={(evento) => setSenhaAtual(evento.target.value)}
                autoComplete="current-password"
              />
            </div>

            <div className="configuracoes-campo">
              <label htmlFor="config-nova-senha">Nova senha</label>
              <input
                id="config-nova-senha"
                type="password"
                value={novaSenha}
                onChange={(evento) => setNovaSenha(evento.target.value)}
                autoComplete="new-password"
              />
            </div>

            <div className="configuracoes-campo">
              <label htmlFor="config-confirmar-senha">
                Confirmar nova senha
              </label>
              <input
                id="config-confirmar-senha"
                type="password"
                value={confirmarSenha}
                onChange={(evento) =>
                  setConfirmarSenha(evento.target.value)
                }
                autoComplete="new-password"
              />
            </div>
          </section>

          <section className="configuracoes-card">
            <h2>Aparência</h2>
            <p>Escolha como deseja visualizar o Questio.</p>

            <div className="configuracoes-opcoes">
              <label>
                <input
                  type="radio"
                  name="tema"
                  value="claro"
                  checked={tema === "claro"}
                  onChange={() => setTema("claro")}
                />
                Tema claro
              </label>

              <label>
                <input
                  type="radio"
                  name="tema"
                  value="escuro"
                  checked={tema === "escuro"}
                  onChange={() => setTema("escuro")}
                />
                Tema escuro
              </label>
            </div>

            <small>
              A aplicação visual do tema será integrada posteriormente.
            </small>
          </section>

          <section className="configuracoes-card">
            <h2>Notificações</h2>
            <p>Escolha se deseja receber avisos da plataforma.</p>

            <label className="configuracoes-checkbox">
              <input
                type="checkbox"
                checked={notificacoes}
                onChange={(evento) =>
                  setNotificacoes(evento.target.checked)
                }
              />
              Receber notificações sobre provas e correções
            </label>
          </section>

          {mensagem && (
            <p className="configuracoes-mensagem" role="status">
              {mensagem}
            </p>
          )}

          <button type="submit" className="configuracoes-salvar">
            Salvar alterações
          </button>
        </form>
      </main>
    </div>
  );
}
