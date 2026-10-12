
import { useState } from 'react'
import '../App.css'
import { Link } from 'react-router-dom'

function Home() {
  const [planoSelecionado, setPlanoSelecionado] = useState('anual')

  return (
    <div>
      {/* CABEÇALHO */}
      <header className="cabecalho">
        <h2 className="logo">🎓 Questio</h2>

        <nav className="menu">
          <a href="#inicio">Início</a>
          <a href="#recursos">Recursos</a>
          <a href="#planos">Planos</a>
        </nav>

     
<div className="botoes">
  <Link to="/login" className="botao-entrar">
    Entrar
  </Link>

  <Link to="/cadastro" className="botao-cadastrar">
    Cadastrar
  </Link>
</div>

      </header>

      <main id="inicio">
        {/* APRESENTAÇÃO */}
        <section className="apresentacao">
          <span className="destaque">
            Uma nova forma de avaliar
          </span>

          <h1>
            Suas avaliações mais simples com o Questio.
          </h1>

          <p>
            Crie provas, organize questões, corrija gabaritos
            e acompanhe resultados em um só lugar.
          </p>

          <div className="acoes">
            <a href="#planos" className="botao-principal">
              Começar agora
            </a>

            <a href="#recursos" className="botao-secundario">
              Conhecer recursos
            </a>
          </div>
        </section>

        {/* FUNCIONALIDADES */}
        <section id="recursos">
          <h2>O que você pode fazer?</h2>

          <div className="cartoes">
            <div className="cartao">
              <span className="icone">📝</span>
              <h3>Criar provas</h3>
              <p>Monte avaliações e organize suas questões.</p>
            </div>

            <div className="cartao">
              <span className="icone">📷</span>
              <h3>Corrigir gabaritos</h3>
              <p>Corrija provas de forma automática.</p>
            </div>

            <div className="cartao">
              <span className="icone">📊</span>
              <h3>Acompanhar resultados</h3>
              <p>Consulte notas e desempenho dos alunos.</p>
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="secao-planos">
          <h2>Escolha o plano ideal para você</h2>

          <p>
            Comece gratuitamente e conheça os recursos do Questio.
          </p>

          <div className="lista-planos">
            {/* PLANO GRATUITO */}
            <div className="plano">
              <h3>Gratuito</h3>
              <h4>R$ 0,00</h4>

              <p>Ideal para começar a usar o Questio.</p>

              <ul>
                <li>✓ Criar provas</li>
                <li>✓ Correção de gabaritos</li>
                <li>✓ Histórico limitado</li>
                <li>✓ Anúncios demonstrativos</li>
              </ul>

              <button className="botao-plano" type="button">
                Começar grátis
              </button>
            </div>

            {/* PLANO PREMIUM */}
            <div className="plano plano-premium">
              <span className="selo-premium">
                Mais recursos
              </span>

              <h3>Premium</h3>

              <div className="precos-premium">
                {/* MENSAL */}
                <button
                  type="button"
                  className={`opcao-preco ${
                    planoSelecionado === 'mensal'
                      ? 'selecionado'
                      : ''
                  }`}
                  onClick={() => setPlanoSelecionado('mensal')}
                  aria-pressed={planoSelecionado === 'mensal'}
                >
                  <h4>R$ 29,99</h4>
                  <p>Mensal</p>
                </button>

                {/* ANUAL */}
                <button
                  type="button"
                  className={`opcao-preco promocao-anual ${
                    planoSelecionado === 'anual'
                      ? 'selecionado'
                      : ''
                  }`}
                  onClick={() => setPlanoSelecionado('anual')}
                  aria-pressed={planoSelecionado === 'anual'}
                >
                  <span className="desconto">20% OFF</span>
                  <h4>R$ 287,90</h4>
                  <p>Anual - pagamento único</p>
                  <small>
                    Equivale a R$ 23,99 por mês
                  </small>
                </button>
              </div>

              <p>
                Para professores que precisam de mais recursos.
              </p>

              <ul>
                <li>✓ Mais provas e correções</li>
                <li>✓ Histórico ampliado</li>
                <li>✓ Relatórios detalhados</li>
                <li>✓ Sem anúncios demonstrativos</li>
              </ul>

              <button className="botao-plano" type="button">
                Escolher Premium{' '}
                {planoSelecionado === 'mensal' ? 'Mensal' : 'Anual'}
              </button>
            </div>
          </div>

          <p className="aviso-planos">
            Planos ilustrativos para apresentação acadêmica.
            Nenhuma cobrança será realizada.
          </p>
        </section>
      </main>
      
<footer className="rodape">
  <div className="rodape-conteudo">
    <div>
      <h2>🎓 Questio</h2>
      <p>
        Simplificando a criação e correção de avaliações.
      </p>
    </div>

    <div className="rodape-links">
      <h3>Navegação</h3>
      <a href="#inicio">Início</a>
      <a href="#recursos">Recursos</a>
      <a href="#planos">Planos</a>
    </div>
  </div>

  <div className="rodape-final">
    <p>© 2026 Questio - Projeto acadêmico.</p>
  </div>
</footer>

    </div>
  )
}

export default Home
