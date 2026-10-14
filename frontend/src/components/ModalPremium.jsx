
import { useEffect, useState } from "react";
import { Crown, X } from "lucide-react";
import { Link } from "react-router-dom";
import "../style components/ModalPremium.css";

const anuncios = [
  {
    nome: "Papel & Ideias",
    imagem: "/anuncios/papel-ideias.png",
  },
  {
    nome: "EduMais",
    imagem: "/anuncios/edumais.png",
  },
  {
    nome: "TechPro",
    imagem: "/anuncios/techpro.png",
  },
  {
    nome: "VivaBem",
    imagem: "/anuncios/vivabem.png",
  },
];

export default function ModalPremium({
  aberto,
  aoFechar,
  origem = "download",
  plano = "gratuito",
}) {
  const [segundos, setSegundos] = useState(15);
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    if (!aberto || plano === "premium") return;

    setSegundos(15);
    setIndice(Math.floor(Math.random() * anuncios.length));
  }, [aberto, plano]);

  useEffect(() => {
    if (!aberto || plano === "premium" || segundos <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSegundos((anterior) => Math.max(0, anterior - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [aberto, plano, segundos]);

  if (!aberto || plano === "premium") {
    return null;
  }

  const anuncioAtual = anuncios[indice];
  const podeFechar = segundos === 0;
  const ehCorrecao = origem === "correcao";

  return (
    <div className="modal-premium-fundo">
      <section
        className="modal-premium-caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-premium-titulo"
      >
        <div className="modal-premium-cabecalho">
          <span>PUBLICIDADE · DEMONSTRAÇÃO</span>

          {podeFechar ? (
            <button
              type="button"
              className="modal-premium-fechar"
              onClick={aoFechar}
            >
              <X size={18} />
              Fechar
            </button>
          ) : (
            <span className="modal-premium-tempo">
              Fechar em {segundos}s
            </span>
          )}
        </div>

        <h2 id="modal-premium-titulo">
          {ehCorrecao
            ? "Correção concluída!"
            : "Sua prova está pronta!"}
        </h2>

        <p className="modal-premium-descricao">
          {ehCorrecao
            ? "Confira esta publicidade antes de visualizar o resultado."
            : "Confira esta publicidade antes de continuar com o download."}
        </p>

        <img
          src={anuncioAtual.imagem}
          alt={`Publicidade fictícia de ${anuncioAtual.nome}`}
          className="modal-premium-imagem"
        />

        <div className="modal-premium-acoes">
          <Link
            to="/planos"
            className="modal-premium-assinar"
          >
            <Crown size={17} />
            Conhecer Questio Premium
          </Link>

          {podeFechar ? (
            <button
              type="button"
              className="modal-premium-continuar"
              onClick={aoFechar}
            >
              {ehCorrecao
                ? "Ver resultado"
                : "Continuar para download"}
            </button>
          ) : (
            <p className="modal-premium-aguarde">
              Aguarde {segundos}s para continuar gratuitamente.
            </p>
          )}
        </div>

        <small>
          Anúncio fictício para demonstração do projeto.
        </small>
      </section>
    </div>
  );
}
