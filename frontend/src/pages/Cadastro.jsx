
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import '../style pages/Cadastro.css'

function Cadastro() {
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)

  function cadastrar(evento) {
    evento.preventDefault()

    if (senha !== confirmarSenha) {
      alert('As senhas não são iguais!')
      return
    }

    alert('O cadastro será conectado ao backend em breve!')
  }

  return (
    <div className="pagina-cadastro">
      <div className="cadastro-card">
        <Link to="/" className="cadastro-logo">
          🎓 Questio
        </Link>

        <h1>Crie sua conta</h1>
        <p>Comece a organizar suas avaliações com facilidade.</p>

        <form onSubmit={cadastrar}>
          <label htmlFor="nome">Nome completo</label>
          <input
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            autoComplete="name"
            required
          />

          <label htmlFor="email-cadastro">E-mail</label>
          <input
            id="email-cadastro"
            type="email"
            placeholder="seuemail@exemplo.com"
            autoComplete="email"
            required
          />

         
<label htmlFor="senha-cadastro">Senha</label>

<div className="campo-senha">
  <input
    id="senha-cadastro"
    type={mostrarSenha ? 'text' : 'password'}
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
    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
  >
    {mostrarConfirmacao ? <Eye size={20} /> : <EyeOff size={20} />}
  </button>
</div>

<label htmlFor="confirmar-senha">Confirmar senha</label>

<div className="campo-senha">
  <input
    id="confirmar-senha"
    type={mostrarConfirmacao ? 'text' : 'password'}
    placeholder="Digite a senha novamente"
    value={confirmarSenha}
    onChange={(evento) => setConfirmarSenha(evento.target.value)}
    minLength={8}
    autoComplete="new-password"
    required
  />

  <button
    type="button"
    className="botao-olho"
    onClick={() => setMostrarConfirmacao(!mostrarConfirmacao)}
    aria-label={mostrarConfirmacao ? 'Ocultar confirmação' : 'Mostrar confirmação'}
  >
    {mostrarSenha ? <Eye size={20} /> : <EyeOff size={20} />}
  </button>
</div>

          

          <button type="submit" className="cadastro-botao">
            Criar conta
          </button>
        </form>

        <p className="cadastro-login">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}

export default Cadastro
