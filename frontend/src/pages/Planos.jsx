
import { useState } from "react";
import { Check, Crown, Sparkles } from "lucide-react";
import MenuLateral from "../components/MenuLateral";
import "../style pages/Planos.css";

export default function Planos() {
  const [periodo, setPeriodo] = useState("anual");
  const [mensagem, setMensagem] = useState("");

  const precoPremium =
    periodo === "mensal" ? "R$ 29,99" : "R$ 287,90";

  const recursosGratuitos = [
    "Acesso ao painel do professor",
    "Criação de provas básicas",
    "Correção de gabaritos",
    "Consulta de resultados",
  ];

  const recursosPremium = [
    "Todos os recursos do plano gratuito",
    "Criação de provas com versões embaralhadas",
    "Histórico completo de avaliações",
    "Relatórios detalhados de desempenho",
    "Recursos avançados de correção",
    "Experiência sem anúncios",
  ];

  function selecionarPlano() {
    setMensagem(
      `Você selecionou o Premium ${periodo}. Esta é uma demonstração: nenhuma cobrança foi realizada.`
    );
  }

  return (
    <div className="pagina-painel">
      <MenuLateral />

      <main className="planos-conteudo">
        <header className="planos-cabecalho">
          <span className="planos-etiqueta">
            <Sparkles size={16} />
            Assinaturas Questio
          </span>

          <h1>Planos e Assinaturas</h1>
          <p>
            Escolha o plano ideal para organizar suas avaliações.
          </p>
        </header>

        <section className="planos-atual">
          <div>
            <span className="planos-legenda">SEU PLANO ATUAL</span>
            <h2>Plano Gratuito</h2>
            <p>
              Você está utilizando a versão gratuita do Questio.
            </p>
          </div>

          <span className="planos-status">Plano ativo</span>
        </section>

        <section className="planos-escolha">
          <h2>Conheça nossos planos</h2>
          <p>
            Compare os benefícios e encontre a melhor opção.
          </p>

          <div
            className="planos-periodos"
            aria-label="Período de assinatura"
          >
            <button
              type="button"
              className={periodo === "mensal" ? "selecionado" : ""}
              onClick={() => {
                setPeriodo("mensal");
                setMensagem("");
              }}
              aria-pressed={periodo === "mensal"}
            >
              Mensal
            </button>

            <button
              type="button"
              className={periodo === "anual" ? "selecionado" : ""}
              onClick={() => {
                setPeriodo("anual");
                setMensagem("");
              }}
              aria-pressed={periodo === "anual"}
            >
              Anual
              <span className="planos-desconto">Economize 20%</span>
            </button>
          </div>

          <div className="planos-grade">
            <article className="plano-card">
              <div className="plano-icone">
                <Check size={23} />
              </div>

              <h3>Gratuito</h3>
              <p className="plano-descricao">
                Para começar a utilizar a plataforma.
              </p>

              <div className="plano-preco">
                <strong>R$ 0,00</strong>
                <span>/ para sempre</span>
              </div>

              <ul className="plano-recursos">
                {recursosGratuitos.map((recurso) => (
                  <li key={recurso}>
                    <Check size={18} />
                    {recurso}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="plano-botao-atual"
                disabled
              >
                Seu plano atual
              </button>
            </article>

            <article className="plano-card plano-card-premium">
              <span className="plano-destaque">
                <Crown size={16} />
                Mais recursos
              </span>

              <div className="plano-icone">
                <Crown size={23} />
              </div>

              <h3>Premium</h3>
              <p className="plano-descricao">
                Para professores que desejam mais praticidade.
              </p>

              <div className="plano-preco">
                <strong>{precoPremium}</strong>
                <span>
                  / {periodo === "mensal" ? "mês" : "ano"}
                </span>
              </div>

              <ul className="plano-recursos">
                {recursosPremium.map((recurso) => (
                  <li key={recurso}>
                    <Check size={18} />
                    {recurso}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="plano-botao-premium"
                onClick={selecionarPlano}
              >
                Escolher Premium
              </button>
            </article>
          </div>

          {mensagem && (
            <p className="planos-mensagem" role="status">
              {mensagem}
            </p>
          )}

          <p className="planos-observacao">
            Os planos e valores são demonstrativos. Nenhum pagamento
            será processado nesta versão do Questio.
          </p>
        </section>
      </main>
    </div>
  );
}
