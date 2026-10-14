
import { useState } from "react";
import { Download, ScanLine } from "lucide-react";
import { Link } from "react-router-dom";
import ModalPremium from "../components/ModalPremium";

export default function TesteAnuncios() {
  const [aberto, setAberto] = useState(false);
  const [origem, setOrigem] = useState("download");
  const [mensagem, setMensagem] = useState("");

  function abrirAnuncio(tipo) {
    setOrigem(tipo);
    setMensagem("");
    setAberto(true);
  }

  function fecharAnuncio() {
    setAberto(false);

    if (origem === "download") {
      setMensagem("Simulação concluída: o download seria iniciado agora.");
    } else {
      setMensagem("Simulação concluída: o resultado seria exibido agora.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "50px 20px",
        background: "var(--cor-fundo)",
        color: "var(--cor-texto)",
      }}
    >
      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        <Link to="/painel" style={{ color: "var(--cor-destaque)" }}>
          ← Voltar ao Painel
        </Link>

        <h1 style={{ color: "var(--cor-titulo)", marginTop: "30px" }}>
          Teste de Publicidade
        </h1>

        <p>
          Simule os anúncios exibidos durante o uso gratuito do Questio.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "15px",
            marginTop: "30px",
          }}
        >
          <button
            type="button"
            onClick={() => abrirAnuncio("download")}
            style={estiloBotao}
          >
            <Download size={20} />
            Simular download de prova
          </button>

          <button
            type="button"
            onClick={() => abrirAnuncio("correcao")}
            style={estiloBotao}
          >
            <ScanLine size={20} />
            Simular correção concluída
          </button>
        </div>

        {mensagem && (
          <p role="status" style={{ marginTop: "25px" }}>
            {mensagem}
          </p>
        )}

        <ModalPremium
          aberto={aberto}
          origem={origem}
          plano="gratuito"
          aoFechar={fecharAnuncio}
        />
      </div>
    </main>
  );
}

const estiloBotao = {
  display: "inline-flex",
  alignItems: "center",
  gap: "10px",
  padding: "15px 20px",
  border: "none",
  borderRadius: "10px",
  background: "#6941c6",
  color: "#ffffff",
  fontWeight: "700",
  cursor: "pointer",
};
