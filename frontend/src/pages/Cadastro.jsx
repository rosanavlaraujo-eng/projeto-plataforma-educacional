
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { chamarAPI } from "../services/apiQuestio";
import "../style pages/Cadastro.css";

function Cadastro() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  async function cadastrar(evento) {
    evento.preventDefault();

    setErro("");
    setSucesso("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não são iguais!");
      return;
    }

    if (senha.length < 8) {
      setErro("A senha deve ter pelo menos 8 caracteres.");
      return;
    }

    setCarregando(true);

    try {
      await chamarAPI("/usuarios/cadastro", {
        metodo: "POST",
        dados: {
          nome: nome.trim(),
          email: email.trim(),
          senha,
        },
      });

      setSucesso("Conta criada com sucesso! Redirecionando para o login...");

      setSenha("");
      setConfirmarSenha("");

      navigate("/login", {
        state: {
          mensagem: "Cadastro realizado com sucesso! Faça seu login.",
        },
      });
    } catch (error) {
      setErro(error.message || "Não foi possível realizar o cadastro.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-cadastro">
      <div className="cadastro-card">
        <Link to="/" className="cadastro-logo">
          🎓 Questio
        </Link>

        <h1>Crie sua conta</h1>

        <p>
          Comece a organizar suas avaliações com facilidade.
        </p>

        <form onSubmit={cadastrar}>
          <label htmlFor="nome">Nome completo</label>

          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            autoComplete="name"
            required
          />

          <label htmlFor="email-cadastro">E-mail</label>

          <input
            id="email-cadastro"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="senha-cadastro">Senha</label>

          <div className="campo-senha">
            <input
              id="senha-cadastro"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Crie uma senha"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="botao-olho"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={
                mostrarSenha ? "Ocultar senha" : "Mostrar senha"
              }
            >
              {mostrarSenha ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>

          <label htmlFor="confirmar-senha">
            Confirmar senha
          </label>

          <div className="campo-senha">
            <input
              id="confirmar-senha"
              type={mostrarConfirmacao ? "text" : "password"}
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(evento) =>
                setConfirmarSenha(evento.target.value)
              }
              minLength={8}
              autoComplete="new-password"
              required
            />

            <button
              type="button"
              className="botao-olho"
              onClick={() =>
                setMostrarConfirmacao(!mostrarConfirmacao)
              }
              aria-label={
                mostrarConfirmacao
                  ? "Ocultar confirmação"
                  : "Mostrar confirmação"
              }
            >
              {mostrarConfirmacao ? (
                <Eye size={20} />
              ) : (
                <EyeOff size={20} />
              )}
            </button>
          </div>

          {erro && (
            <p
              role="alert"
              style={{
                color: "#dc2626",
                fontSize: "14px",
                marginTop: "15px",
              }}
            >
              {erro}
            </p>
          )}

          {sucesso && (
            <p
              role="status"
              style={{
                color: "#16a34a",
                fontSize: "14px",
                marginTop: "15px",
              }}
            >
              {sucesso}
            </p>
          )}

          <button
            type="submit"
            className="cadastro-botao"
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        <p className="cadastro-login">
          Já tem uma conta?{" "}
          <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

export default Cadastro;
