
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { chamarAPI } from "../services/apiQuestio";
import "../style pages/Login.css";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const mensagemCadastro = location.state?.mensagem;

  async function entrar(evento) {
    evento.preventDefault();

    if (carregando) return;

    setErro("");
    setCarregando(true);

    try {
      // Envia e-mail e senha para o backend.
      const resultado = await chamarAPI("/usuarios/login", {
        metodo: "POST",
        dados: {
          email: email.trim(),
          senha,
        },
      });

      // O backend precisa retornar um token válido.
      if (!resultado.token) {
        throw new Error(
          "O servidor não retornou um token de autenticação."
        );
      }

      // Guarda o token para as próximas chamadas à API.
      localStorage.setItem("questio-token", resultado.token);

      // Confirma que o token permite consultar o usuário.
      await chamarAPI("/usuarios/me", {
        token: resultado.token,
      });

      // Abre o painel após a autenticação.
      navigate("/painel", {
        replace: true,
      });
    } catch (error) {
      // Evita manter um token de uma tentativa malsucedida.
      localStorage.removeItem("questio-token");

      if (error instanceof TypeError) {
        setErro(
          "Não foi possível conectar ao servidor. Verifique se o backend está ligado."
        );
      } else {
        setErro(
          error.message || "Não foi possível realizar o login."
        );
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="pagina-login">
      <div className="login-card">
        <Link to="/" className="login-logo">
          🎓 Questio
        </Link>

        <h1>Bem-vindo de volta!</h1>

        <p>Entre na sua conta para continuar.</p>

        {mensagemCadastro && (
          <p
            role="status"
            style={{
              color: "#15803d",
              fontSize: "14px",
              marginTop: "15px",
            }}
          >
            {mensagemCadastro}
          </p>
        )}

        <form onSubmit={entrar}>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            autoComplete="email"
            required
          />

          <label htmlFor="senha">Senha</label>

          <div className="campo-senha">
            <input
              id="senha"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              autoComplete="current-password"
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

          <button
            type="submit"
            className="login-botao"
            disabled={carregando}
          >
            {carregando ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="login-cadastro">
          Ainda não tem uma conta?{" "}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
