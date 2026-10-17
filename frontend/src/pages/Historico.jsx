
import { useState } from "react";
import MenuLateral from "../components/MenuLateral";
import {
  listarHistorico,
  excluirHistorico,
} from "../correcao/historicoLocal.js";

export default function Historico() {
  const [registros, setRegistros] = useState(() => listarHistorico());
  const [busca, setBusca] = useState("");

  function excluir(id) {
    if (!window.confirm("Deseja excluir este registro do histórico?")) {
      return;
    }

    excluirHistorico(id);
    setRegistros(listarHistorico());
  }

  const filtrados = registros.filter((item) =>
    `${item.aluno || ""} ${item.titulo || ""} ${item.versao || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  function formatarData(data) {
    if (!data) return "—";

    const valor = new Date(data);

    return Number.isNaN(valor.getTime())
      ? "—"
      : valor.toLocaleString("pt-BR");
  }

  return (
    <div className="pagina-painel">
      <MenuLateral />

      <main className="painel-conteudo" style={{ padding: 30 }}>
        <h1>Histórico de Correções</h1>
        <p>Acompanhe as avaliações corrigidas anteriormente.</p>

        <section className="questio-historico-box">
          <div className="questio-historico-topo">
            <h2>Correções registradas: {filtrados.length}</h2>

            <input
              placeholder="Pesquisar aluno ou prova..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>

          {filtrados.length === 0 ? (
            <p>Nenhuma correção registrada até o momento.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="questio-historico-tabela">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Aluno</th>
                    <th>Prova</th>
                    <th>Versão</th>
                    <th>Nota</th>
                    <th>Situação</th>
                    <th>Ações</th>
                  </tr>
                </thead>

                <tbody>
                  {filtrados.map((item) => (
                    <tr key={item.id}>
                      <td>{formatarData(item.dataCorrecao)}</td>
                      <td>{item.aluno || "Não informado"}</td>
                      <td>{item.titulo || "Avaliação"}</td>
                      <td>{item.versao}</td>
                      <td>
                        <strong>
                          {Number(item.nota || 0).toFixed(1)}
                        </strong>
                      </td>
                      <td>
                        {item.provisoria
                          ? "Revisão pendente"
                          : "Corrigida"}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="questio-excluir"
                          onClick={() => excluir(item.id)}
                        >
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <style>{`
          .questio-historico-box {
            background: var(--card-bg, #fff);
            color: var(--text-color, inherit);
            border: 1px solid #a78bfa44;
            border-radius: 14px;
            padding: 22px;
            margin-top: 25px;
          }

          .questio-historico-topo {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            flex-wrap: wrap;
            margin-bottom: 20px;
          }

          .questio-historico-topo input {
            padding: 12px;
            border: 1px solid #a78bfa;
            border-radius: 8px;
            background: transparent;
            color: inherit;
          }

          .questio-historico-tabela {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
          }

          .questio-historico-tabela th,
          .questio-historico-tabela td {
            padding: 13px;
            border-bottom: 1px solid #a78bfa44;
          }

          .questio-excluir {
            background: #7f1d1d;
            color: #fff;
            border: none;
            border-radius: 7px;
            padding: 8px 12px;
            cursor: pointer;
          }
        `}</style>
      </main>
    </div>
  );
}
