
import { useState } from "react";
import { Crown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import "../style components/Anuncio.css";

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

export default function Anuncio({ plano = "gratuito" }) {
  const [indice, setIndice] = useState(0);
  const [visivel, setVisivel] = useState(true);

  if (plano === "premium" || !visivel) {
    return null;
  }

  const anuncioAtual = anuncios[indice];

  function mudarAnuncio(direcao) {
    setIndice((anterior) =>
      (anterior + direcao + anuncios.length) % anuncios.length
    );
  }

  return (
    <aside
      className="anuncio-banner"
      aria-label="Publicidade demonstrativa"
    >
      <div className="anuncio-banner-topo">
        <span>PUBLICIDADE · DEMONSTRAÇÃO</span>

        <button
          type="button"
          className="anuncio-banner-fechar"
          onClick={() => setVisivel(false)}
          aria-label="Fechar publicidade"
        >
          <X size={17} />
        </button>
      </div>

      <img
        src={anuncioAtual.imagem}
        alt={`Publicidade fictícia de ${anuncioAtual.nome}`}
        className="anuncio-banner-imagem"
      />

      <div className="anuncio-banner-rodape">
        <div className="anuncio-banner-navegacao">
          <button
            type="button"
            onClick={() => mudarAnuncio(-1)}
            aria-label="Anúncio anterior"
          >
            <ChevronLeft size={18} />
          </button>

          <span>
            {indice + 1} de {anuncios.length}
          </span>

          <button
            type="button"
            onClick={() => mudarAnuncio(1)}
            aria-label="Próximo anúncio"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <Link to="/planos" className="anuncio-banner-premium">
          <Crown size={15} />
          Remover anúncios
        </Link>
      </div>
    </aside>
  );
}
