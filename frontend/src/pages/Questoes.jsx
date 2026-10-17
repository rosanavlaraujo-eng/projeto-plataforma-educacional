
import { useState } from "react";

import MenuLateral from "../components/MenuLateral";
import ModalPremium from "../components/ModalPremium";
import FolhaResposta from "../components/FolhaResposta";
import CartaoResposta from "../components/CartaoResposta";

import { registrarProva } from "../correcao/store.js";

import "../style pages/Questoes.css";

const LETRAS = ["A", "B", "C", "D", "E"];

const INSTRUCOES = [
  "Preencha todos os campos de identificação.",
  "Confira a versão da avaliação antes de começar.",
  "Cada questão possui apenas uma alternativa correta.",
  "Marque somente uma alternativa por questão.",
  "Preencha completamente a bolinha escolhida.",
  "Evite rasuras e marcações duplas.",
  "Entregue a avaliação conforme orientação do professor.",
];

function criarId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function criarAlternativas() {
  return [
    { id: criarId(), texto: "", correta: false },
    { id: criarId(), texto: "", correta: false },
  ];
}

function embaralhar(lista) {
  const resultado = [...lista];

  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [resultado[i], resultado[j]] = [
      resultado[j],
      resultado[i],
    ];
  }

  return resultado;
}

const cabecalhoInicial = {
  instituicao: "",
  provaTitulo: "",
  curso: "",
  disciplina: "",
  professor: "",
  turma: "",
  data: "",
  polo: "",
};

export default function Questoes() {
  const [cabecalho, setCabecalho] = useState({
    ...cabecalhoInicial,
  });

  const [enunciado, setEnunciado] = useState("");
  const [alternativas, setAlternativas] = useState(
    criarAlternativas
  );

  const [questoes, setQuestoes] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [provaId, setProvaId] = useState(criarId);
  const [versoesProva, setVersoesProva] = useState(null);

  const [aba, setAba] = useState("cadastro");

  const [impressaoAlvo, setImpressaoAlvo] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [pedidoPendente, setPedidoPendente] = useState(null);

  const plano = "gratuito";

  function alterarCabecalho(campo, valor) {
    setCabecalho((atual) => ({
      ...atual,
      [campo]: valor,
    }));
  }

  function alterarAlternativa(id, texto) {
    setAlternativas((atual) =>
      atual.map((alternativa) =>
        alternativa.id === id
          ? { ...alternativa, texto }
          : alternativa
      )
    );
  }

  function marcarCorreta(id) {
    setAlternativas((atual) =>
      atual.map((alternativa) => ({
        ...alternativa,
        correta: alternativa.id === id,
      }))
    );
  }

  function adicionarAlternativa() {
    if (alternativas.length >= 5) {
      alert("O máximo é de cinco alternativas.");
      return;
    }

    setAlternativas((atual) => [
      ...atual,
      {
        id: criarId(),
        texto: "",
        correta: false,
      },
    ]);
  }

  function removerAlternativa(id) {
    if (alternativas.length <= 2) {
      alert("A questão precisa ter pelo menos duas alternativas.");
      return;
    }

    setAlternativas((atual) =>
      atual.filter((alternativa) => alternativa.id !== id)
    );
  }

  function limparFormulario() {
    setEnunciado("");
    setAlternativas(criarAlternativas());
    setEditandoId(null);
  }

  function salvarQuestao(evento) {
    evento.preventDefault();

    if (!enunciado.trim()) {
      alert("Digite o enunciado.");
      return;
    }

    if (alternativas.some((alternativa) => !alternativa.texto.trim())) {
      alert("Preencha todas as alternativas.");
      return;
    }

    if (!alternativas.some((alternativa) => alternativa.correta)) {
      alert("Selecione a alternativa correta.");
      return;
    }

    if (editandoId === null && questoes.length >= 40) {
      alert("O limite é de 40 questões.");
      return;
    }

    const dados = {
      enunciado: enunciado.trim(),
      alternativas: alternativas.map((alternativa) => ({
        ...alternativa,
        texto: alternativa.texto.trim(),
      })),
    };

    if (editandoId !== null) {
      setQuestoes((atual) =>
        atual.map((questao) =>
          questao.id === editandoId
            ? { ...questao, ...dados }
            : questao
        )
      );
    } else {
      setQuestoes((atual) => [
        ...atual,
        {
          id: criarId(),
          ...dados,
        },
      ]);
    }

    setVersoesProva(null);
    limparFormulario();
  }

  function editarQuestao(questao) {
    setEditandoId(questao.id);
    setEnunciado(questao.enunciado);

    setAlternativas(
      questao.alternativas.map((alternativa) => ({
        ...alternativa,
      }))
    );

    setAba("cadastro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function excluirQuestao(id) {
    if (!window.confirm("Deseja excluir esta questão?")) {
      return;
    }

    setQuestoes((atual) =>
      atual.filter((questao) => questao.id !== id)
    );

    setVersoesProva(null);

    if (editandoId === id) {
      limparFormulario();
    }
  }

  function gerarVersoes() {
    if (!cabecalho.instituicao.trim()) {
      alert("Informe o nome da instituição.");
      return;
    }

    if (questoes.length === 0) {
      alert("Cadastre pelo menos uma questão.");
      return;
    }

    const gerar = () =>
      embaralhar(questoes).map((questao) => ({
        ...questao,
        alternativas: embaralhar(questao.alternativas),
      }));

    const novasVersoes = {
      A: gerar(),
      B: gerar(),
    };

    setVersoesProva(novasVersoes);

    registrarProva({
      provaId,
      titulo:
        cabecalho.provaTitulo.trim() ||
        "Avaliação de Conhecimentos",
      versoesProva: novasVersoes,
    });

    setAba("aluno");
  }

  function mudarAba(destino) {
    if (destino !== "cadastro" && !versoesProva) {
      alert("Gere as versões da prova primeiro.");
      return;
    }

    setAba(destino);
  }

  function novaProva() {
    if (
      !window.confirm(
        "Deseja começar uma nova prova? Os dados desta tela serão limpos."
      )
    ) {
      return;
    }

    setCabecalho({ ...cabecalhoInicial });
    setQuestoes([]);
    setVersoesProva(null);
    setProvaId(criarId());
    setAba("cadastro");
    limparFormulario();
  }

  function executarImpressao(tipo, versao) {
    setImpressaoAlvo(`${tipo}-${versao}`);

    setTimeout(() => {
      window.print();
    }, 400);
  }

  function solicitarImpressao(tipo, versao) {
    if (plano === "premium") {
      executarImpressao(tipo, versao);
      return;
    }

    setPedidoPendente({ tipo, versao });
    setModalAberto(true);
  }

  function continuarImpressao() {
    setModalAberto(false);

    if (pedidoPendente) {
      executarImpressao(
        pedidoPendente.tipo,
        pedidoPendente.versao
      );
    }

    setPedidoPendente(null);
  }

  function botaoImprimir(tipo, versao, texto) {
    return (
      <div className="questio-acoes-impressao no-print">
        <button
          type="button"
          className="btn-principal"
          onClick={() => solicitarImpressao(tipo, versao)}
        >
          🖨️ {texto}
        </button>
      </div>
    );
  }

  function tabelaIdentificacao() {
    return (
      <table className="questio-tabela-identificacao">
        <tbody>
          <tr>
            <th>CURSO</th>
            <td colSpan={3}>{cabecalho.curso}</td>
          </tr>

          <tr>
            <th>DISCIPLINA</th>
            <td colSpan={3}>{cabecalho.disciplina}</td>
          </tr>

          <tr>
            <th>PROFESSOR</th>
            <td colSpan={3}>{cabecalho.professor}</td>
          </tr>

          <tr>
            <th>TURMA</th>
            <td>{cabecalho.turma}</td>
            <th>DATA</th>
            <td>{cabecalho.data}</td>
          </tr>

          <tr>
            <th>ALUNO(A)</th>
            <td colSpan={3}>&nbsp;</td>
          </tr>

          <tr>
            <th>MATRÍCULA</th>
            <td>&nbsp;</td>
            <th>POLO</th>
            <td>{cabecalho.polo}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  function cabecalhoDaProva(versao) {
    return (
      <header className="questio-cabecalho-universitario">
        <div className="questio-identidade-instituicao">
          <div className="questio-nome-instituicao">
            {cabecalho.instituicao}
          </div>

          <h2>
            {cabecalho.provaTitulo ||
              "AVALIAÇÃO DE CONHECIMENTOS"}
          </h2>

          <span className="questio-versao-etiqueta">
            VERSÃO {versao}
          </span>
        </div>

        {tabelaIdentificacao()}
      </header>
    );
  }

  function quadroInstrucoes() {
    return (
      <section className="questio-instrucoes-papel">
        <h3>ATENÇÃO — LEIA ANTES DE COMEÇAR</h3>

        <ol>
          {INSTRUCOES.map((instrucao, indice) => (
            <li key={indice}>{instrucao}</li>
          ))}
        </ol>
      </section>
    );
  }

  function cartaoDeRespostas(versao) {
    if (!versoesProva?.[versao]) {
      return null;
    }

    return (
      <CartaoResposta
        provaId={provaId}
        versao={versao}
        numQuestoes={versoesProva[versao].length}
      />
    );
  }

  function renderizarProva(versao) {
    return (
      <article
        key={versao}
        className="questio-papel"
        data-impressao={`prova-${versao}`}
      >
        {botaoImprimir(
          "prova",
          versao,
          `Imprimir Prova ${versao}`
        )}

        {cabecalhoDaProva(versao)}

        {quadroInstrucoes()}

        {cartaoDeRespostas(versao)}

        <div className="questio-separador-questoes">
          QUESTÕES DA AVALIAÇÃO
        </div>

        <div className="questio-questoes-papel">
          {versoesProva[versao].map((questao, indice) => (
            <div
              key={questao.id}
              className="questio-questao-papel"
            >
              <p>
                <strong>{indice + 1}.</strong>{" "}
                {questao.enunciado}
              </p>

              <ol type="A">
                {questao.alternativas.map((alternativa) => (
                  <li key={alternativa.id}>
                    {alternativa.texto}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        <footer className="questio-rodape-papel">
          Questio • {cabecalho.provaTitulo || "Avaliação"} •
          Versão {versao}
        </footer>
      </article>
    );
  }

  function renderizarFolha(versao) {
    return (
      <article
        key={versao}
        className="questio-papel questio-papel-folha"
        data-impressao={`folha-${versao}`}
      >
        {botaoImprimir(
          "folha",
          versao,
          `Imprimir Folha ${versao}`
        )}

        <FolhaResposta
          provaId={provaId}
          versao={versao}
          titulo={
            cabecalho.provaTitulo ||
            "Avaliação de Conhecimentos"
          }
          numQuestoes={versoesProva[versao].length}
        />
      </article>
    );
  }

  function renderizarGabarito(versao) {
    const lista = versoesProva[versao];

    return (
      <article
        key={versao}
        className="questio-papel"
        data-impressao={`gabarito-${versao}`}
      >
        {botaoImprimir(
          "gabarito",
          versao,
          `Imprimir Gabarito ${versao}`
        )}

        <div className="questio-identidade-instituicao">
          <div className="questio-nome-instituicao">
            {cabecalho.instituicao}
          </div>

          <h2>GABARITO DO PROFESSOR</h2>

          <span className="questio-versao-etiqueta">
            VERSÃO {versao}
          </span>
        </div>

        <p className="questio-titulo-gabarito">
          {cabecalho.provaTitulo ||
            "Avaliação de Conhecimentos"}
        </p>

        <div className="questio-gabarito-professor">
          <table>
            <thead>
              <tr>
                {lista.map((questao, indice) => (
                  <th key={questao.id}>{indice + 1}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              <tr>
                {lista.map((questao) => {
                  const indiceCorreto =
                    questao.alternativas.findIndex(
                      (alternativa) => alternativa.correta
                    );

                  return (
                    <td key={questao.id}>
                      {LETRAS[indiceCorreto] || "?"}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        <p className="questio-aviso-professor">
          Documento exclusivo do professor.
          Não entregar aos alunos.
        </p>
      </article>
    );
  }

  return (
    <div className="pagina-painel">
      <div className="no-print">
        <MenuLateral />
      </div>

      <main className="painel-conteudo">
        <div className="questoes-container">
          <div className="questio-topo no-print">
            <div>
              <h2>Questões e Provas</h2>

              <p>
                Crie avaliações com cabeçalho,
                QR Code e gabarito.
              </p>
            </div>

            <button
              type="button"
              className="btn-secundario"
              onClick={novaProva}
            >
              + Nova Prova
            </button>
          </div>

          <div className="questio-abas no-print">
            {[
              ["cadastro", "Cadastrar Questões"],
              ["aluno", "Prova do Aluno"],
              ["folha", "Folha de Respostas"],
              ["gabarito", "Gabarito do Professor"],
            ].map(([id, titulo]) => (
              <button
                key={id}
                type="button"
                className={
                  aba === id
                    ? "btn-principal"
                    : "btn-secundario"
                }
                onClick={() => mudarAba(id)}
              >
                {titulo}
              </button>
            ))}
          </div>

          {aba === "cadastro" && (
            <div className="no-print">
              <section className="questoes-form">
                <h3>Dados da Avaliação</h3>

                {[
                  ["instituicao", "Instituição"],
                  ["provaTitulo", "Título da Prova"],
                  ["curso", "Curso"],
                  ["disciplina", "Disciplina"],
                  ["professor", "Professor(a)"],
                  ["turma", "Turma"],
                  ["data", "Data da Prova"],
                  ["polo", "Polo"],
                ].map(([campo, rotulo]) => (
                  <div
                    key={campo}
                    className="form-group"
                  >
                    <label>{rotulo}</label>

                    <input
                      type="text"
                      value={cabecalho[campo]}
                      onChange={(evento) =>
                        alterarCabecalho(
                          campo,
                          evento.target.value
                        )
                      }
                    />
                  </div>
                ))}
              </section>

              <form
                className="questoes-form"
                onSubmit={salvarQuestao}
              >
                <h3>
                  {editandoId
                    ? "Editar Questão"
                    : "Nova Questão"}
                </h3>

                <div className="form-group">
                  <label>Enunciado</label>

                  <textarea
                    rows={3}
                    value={enunciado}
                    onChange={(evento) =>
                      setEnunciado(evento.target.value)
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Alternativas</label>

                  {alternativas.map((alternativa, indice) => (
                    <div
                      key={alternativa.id}
                      className="alternativa-row"
                    >
                      <input
                        type="radio"
                        name="alternativaCorreta"
                        checked={alternativa.correta}
                        onChange={() =>
                          marcarCorreta(alternativa.id)
                        }
                        title="Marcar como correta"
                      />

                      <span>{LETRAS[indice]}</span>

                      <input
                        type="text"
                        value={alternativa.texto}
                        placeholder={`Alternativa ${LETRAS[indice]}`}
                        onChange={(evento) =>
                          alterarAlternativa(
                            alternativa.id,
                            evento.target.value
                          )
                        }
                        required
                      />

                      <button
                        type="button"
                        className="btn-remover"
                        onClick={() =>
                          removerAlternativa(alternativa.id)
                        }
                      >
                        X
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-secundario"
                    onClick={adicionarAlternativa}
                    disabled={alternativas.length >= 5}
                  >
                    + Alternativa
                  </button>
                </div>

                <div className="questio-acoes">
                  <button
                    type="submit"
                    className="btn-principal"
                  >
                    {editandoId
                      ? "Atualizar Questão"
                      : "Salvar Questão"}
                  </button>

                  {editandoId && (
                    <button
                      type="button"
                      className="btn-secundario"
                      onClick={limparFormulario}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>

              <section className="lista-section">
                <h3>
                  Questões cadastradas: {questoes.length}/40
                </h3>

                {questoes.length === 0 ? (
                  <p>Nenhuma questão cadastrada.</p>
                ) : (
                  <>
                    {questoes.map((questao, indice) => (
                      <div
                        key={questao.id}
                        className="questao-card"
                      >
                        <strong>
                          {indice + 1}. {questao.enunciado}
                        </strong>

                        <ul>
                          {questao.alternativas.map(
                            (alternativa) => (
                              <li key={alternativa.id}>
                                {alternativa.texto}
                                {alternativa.correta &&
                                  " ✓ Correta"}
                              </li>
                            )
                          )}
                        </ul>

                        <div className="questio-acoes">
                          <button
                            type="button"
                            className="btn-secundario"
                            onClick={() =>
                              editarQuestao(questao)
                            }
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            className="btn-remover"
                            onClick={() =>
                              excluirQuestao(questao.id)
                            }
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="btn-gerar"
                      onClick={gerarVersoes}
                    >
                      Gerar Versões A e B
                    </button>
                  </>
                )}
              </section>
            </div>
          )}

          {aba === "aluno" && versoesProva && (
            <div className="questio-versoes">
              <h3 className="no-print">
                Provas do Aluno
              </h3>

              {["A", "B"].map(renderizarProva)}
            </div>
          )}

          {aba === "folha" && versoesProva && (
            <div className="questio-versoes">
              <h3 className="no-print">
                Folhas para Correção por Foto
              </h3>

              <p className="no-print">
                Estas folhas seguem o modelo
                padronizado do leitor automático.
              </p>

              {["A", "B"].map(renderizarFolha)}
            </div>
          )}

          {aba === "gabarito" && versoesProva && (
            <div className="questio-versoes">
              <h3 className="no-print">
                Gabaritos do Professor
              </h3>

              {["A", "B"].map(renderizarGabarito)}
            </div>
          )}
        </div>
      </main>

      <ModalPremium
        aberto={modalAberto}
        aoFechar={continuarImpressao}
        origem="download"
        plano={plano}
      />

      <style>
        {`
          .questio-topo,
          .questio-abas,
          .questio-acoes {
            display: flex;
            gap: 12px;
            flex-wrap: wrap;
            align-items: center;
          }

          .questio-topo {
            justify-content: space-between;
            margin-bottom: 20px;
          }

          .questio-abas {
            margin-bottom: 24px;
          }

          .questio-papel {
            background: #fff;
            color: #111;
            padding: 32px;
            margin: 24px 0;
            border: 1px solid #ddd;
            border-radius: 8px;
          }

          .questio-acoes-impressao {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 18px;
          }

          .questio-identidade-instituicao {
            text-align: center;
            margin-bottom: 28px;
          }

          .questio-nome-instituicao {
            font-size: 25px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
          }

          .questio-identidade-instituicao h2 {
            font-size: 20px;
            font-weight: 800;
            color: #111;
            text-transform: uppercase;
            margin: 0 0 10px;
          }

          .questio-versao-etiqueta {
            display: inline-block;
            font-size: 10px;
            font-weight: 700;
            padding: 4px 10px;
            border: 1px solid #333;
          }

          .questio-tabela-identificacao {
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
            margin-bottom: 24px;
            font-size: 12px;
          }

          .questio-tabela-identificacao th,
          .questio-tabela-identificacao td {
            border: 1.5px solid #111;
            padding: 7px 8px;
            text-align: left;
            height: 30px;
            overflow-wrap: anywhere;
          }

          .questio-tabela-identificacao th {
            width: 21%;
            font-weight: 800;
            background: #f7f7f7;
          }

          .questio-instrucoes-papel {
            border: 1px solid #555;
            margin-bottom: 24px;
            break-inside: avoid;
          }

          .questio-instrucoes-papel h3 {
            background: #e8e8e8;
            color: #111;
            text-align: center;
            font-size: 13px;
            font-weight: 800;
            padding: 7px;
            margin: 0;
            border-bottom: 1px solid #555;
          }

          .questio-instrucoes-papel ol {
            margin: 0;
            padding: 14px 18px 14px 35px;
            font-size: 11px;
            line-height: 1.55;
          }

          .questio-instrucoes-papel li {
            margin-bottom: 4px;
          }

          .questio-separador-questoes {
            text-align: center;
            border-top: 1px solid #444;
            border-bottom: 1px solid #444;
            padding: 8px;
            margin: 24px 0 22px;
            font-size: 13px;
            font-weight: 800;
          }

          .questio-questoes-papel {
            font-size: 12px;
            line-height: 1.6;
          }

          .questio-questao-papel {
            margin-bottom: 20px;
            break-inside: avoid;
          }

          .questio-questao-papel p {
            margin-bottom: 8px;
          }

          .questio-questao-papel ol {
            margin-top: 5px;
            padding-left: 25px;
          }

          .questio-questao-papel li {
            margin-bottom: 3px;
          }

          .questio-rodape-papel {
            border-top: 1px solid #aaa;
            margin-top: 30px;
            padding-top: 10px;
            text-align: center;
            font-size: 9px;
          }

          .questio-titulo-gabarito {
            text-align: center;
            font-size: 14px;
            margin-bottom: 22px;
          }

          .questio-gabarito-professor {
            width: 100%;
            overflow-x: auto;
          }

          .questio-gabarito-professor table {
            border-collapse: collapse;
            width: 100%;
          }

          .questio-gabarito-professor th,
          .questio-gabarito-professor td {
            border: 1px solid #444;
            padding: 9px 5px;
            text-align: center;
            font-size: 11px;
          }

          .questio-gabarito-professor th {
            background: #dbe8f7;
            font-weight: 800;
          }

          .questio-gabarito-professor td {
            font-weight: 800;
          }

          .questio-aviso-professor {
            margin-top: 25px;
            font-size: 11px;
            font-weight: 700;
            text-align: center;
          }

          .questio-papel-folha .folha-resposta {
            display: block;
            width: 100%;
            max-width: 210mm;
            height: auto;
            margin: 0 auto;
          }

          @media (max-width: 650px) {
            .questio-papel {
              padding: 12px;
            }

            .questio-tabela-identificacao {
              font-size: 9px;
            }

            .questio-tabela-identificacao th,
            .questio-tabela-identificacao td {
              padding: 4px;
            }
          }

          @media print {
            @page {
              size: A4;
              margin: 0;
            }

            body * {
              visibility: hidden !important;
            }

            [data-impressao="${impressaoAlvo}"],
            [data-impressao="${impressaoAlvo}"] * {
              visibility: visible !important;
            }

            [data-impressao="${impressaoAlvo}"] {
              position: absolute !important;
              top: 0 !important;
              left: 0 !important;
              width: 210mm !important;
              max-width: none !important;
              padding: 12mm !important;
              margin: 0 !important;
              box-sizing: border-box !important;
              border: none !important;
              border-radius: 0 !important;
              background: #fff !important;
              color: #111 !important;
            }

            [data-impressao="${impressaoAlvo}"] .no-print,
            [data-impressao="${impressaoAlvo}"] .no-print * {
              display: none !important;
              visibility: hidden !important;
            }

            .questio-instrucoes-papel,
            .questio-questao-papel {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            .questio-instrucoes-papel h3,
            .questio-gabarito-professor th {
              print-color-adjust: exact;
              -webkit-print-color-adjust: exact;
            }

            [data-impressao="${impressaoAlvo}"].questio-papel-folha {
              padding: 0 !important;
            }

            [data-impressao="${impressaoAlvo}"].questio-papel-folha
            .folha-resposta {
              width: 210mm !important;
              height: 297mm !important;
              max-width: none !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
}
