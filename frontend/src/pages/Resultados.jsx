
import { useMemo, useState } from "react";
import MenuLateral from "../components/MenuLateral";
import { listarHistorico } from "../correcao/historicoLocal.js";

export default function Resultados() {
  const [registros] = useState(() => listarHistorico());
  const [busca, setBusca] = useState("");

  const filtrados = useMemo(
    () =>
      registros.filter((item) =>
        `${item.aluno || ""} ${item.titulo || ""} ${item.versao || ""}`
          .toLowerCase()
          .includes(busca.toLowerCase())
      ),
    [registros, busca]
  );

  const media = filtrados.length
    ? filtrados.reduce((soma, item) => soma + Number(item.nota || 0), 0) /
      filtrados.length
    : 0;

  const totalAcertos = filtrados.reduce(
    (soma, item) => soma + Number(item.acertos || 0),
    0
  );

  const totalErros = filtrados.reduce(
    (soma, item) => soma + Number(item.erros || 0),
    0
  );

  return (
    <div className="pagina-painel">
      <MenuLateral />

      <main className="painel-conteudo" style={{ padding: 30 }}>
        <h1>Resultados</h1>
        <p>Consulte o desempenho das avaliações corrigidas.</p>

        <div className="questio-resumo-grid">
          <div className="questio-resumo-card">
            <span>Correções</span>
            <strong>{filtrados.length}</strong>
          </div>

          <div className="questio-resumo-card">
            <span>Média das notas</span>
            <strong>{media.toFixed(1)}</strong>
          </div>

          <div className="questio-resumo-card">
            <span>Total de acertos</span>
            <strong>{totalAcertos}</strong>
          </div>

          <div className="questio-resumo-card">
            <span>Total de erros</span>
            <strong>{totalErros}</strong>
          </div>
        </div>

        <section className="questio-historico-painel">
          <h2>Notas dos alunos</h2>

          <input
            className="questio-busca"
            placeholder="Pesquisar aluno ou prova..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          {filtrados.length === 0 ? (
            <p>Nenhum resultado encontrado.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="questio-tabela-dados">
                <thead>
                  <tr>
                    <th>Aluno</th>
                    <th>Prova</th>
                    <th>Versão</th>
                    <th>Acertos</th>
                    <th>Erros</th>
                    <th>Nota</th>
                  </tr>
                </thead>
                <tbody>
                  {filtrados.map((item) => (
                    <tr key={item.id}>
                      <td>{item.aluno || "Não informado"}</td>
                      <td>{item.titulo || "Avaliação"}</td>
                      <td>{item.versao}</td>
                      <td>{item.acertos}</td>
                      <td>{item.erros}</td>
                      <td>
                        <strong>{Number(item.nota).toFixed(1)}</strong>
                        {item.provisoria ? " (provisória)" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <style>{`
          .questio-resumo-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 16px;
            margin: 25px 0;
          }
          .questio-resumo-card,
          .questio-historico-painel {
            background: var(--card-bg, #fff);
            color: var(--text-color, inherit);
            border: 1px solid #a78bfa44;
            border-radius: 14px;
            padding: 20px;
          }
          .questio-resumo-card span {
            display: block;
            opacity: .75;
            margin-bottom: 12px;
          }
          .questio-resumo-card strong {
            font-size: 28px;
            color: #a78bfa;
          }
          .questio-busca {
            width: 100%;
            max-width: 420px;
            padding: 12px;
            margin: 12px 0 20px;
            border: 1px solid #a78bfa;
            border-radius: 8px;
            background: transparent;
            color: inherit;
            box-sizing: border-box;
          }
          .questio-tabela-dados {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }
          .questio-tabela-dados th,
          .questio-tabela-dados td {
            padding: 13px;
            border-bottom: 1px solid #a78bfa44;
          }
        `}</style>
      </main>
    </div>
  );
}
