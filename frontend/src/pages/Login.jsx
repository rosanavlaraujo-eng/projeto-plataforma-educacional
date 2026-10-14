
import { Link } from 'react-router-dom'
import '../style pages/Login.css'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

function Login() {
    const [mostrarSenha, setMostrarSenha] = useState(false)
  function entrar(evento) {
    evento.preventDefault()
    alert('O login será conectado ao backend em breve!')
  }

  return (
    <div className="pagina-login">
      <div className="login-card">
        <Link to="/" className="login-logo">
          🎓 Questio
        </Link>

        <h1>Bem-vindo de volta!</h1>
        <p>Entre na sua conta para continuar.</p>

        <form onSubmit={entrar}>
          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@exemplo.com"
            required
          />

          
<label htmlFor="senha">Senha</label>

<div className="campo-senha">
  <input
    id="senha"
    type={mostrarSenha ? 'text' : 'password'}
    placeholder="Digite sua senha"
    autoComplete="current-password"
    required
  />

  <button
    type="button"
    className="botao-olho"
    onClick={() => setMostrarSenha(!mostrarSenha)}
    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
  >
    {mostrarSenha ? <Eye size={20} /> : <EyeOff size={20} />}
  </button>
</div>


          <button type="submit" className="login-botao">
            Entrar
          </button>
        </form>

        <p className="login-cadastro">
          Ainda não tem uma conta?{' '}
          <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
