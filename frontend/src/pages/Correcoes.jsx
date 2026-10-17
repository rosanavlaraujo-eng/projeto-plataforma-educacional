import { useMemo, useState } from 'react';
import MenuLateral from '../components/MenuLateral';
import FolhaResposta from '../components/FolhaResposta';
import { LETRAS } from '../correcao/layoutFolha.js';
import { listarProvas } from '../correcao/store.js';
import { gabaritoDaVersao, corrigirFolha } from '../correcao/corrigir.js';
import { lerFolha } from '../correcao/leitura.js';
import { lerQrCode } from '../correcao/qr.js';
import { lerTextoQr } from '../correcao/codigoQr.js';
import { enviarResultado } from '../correcao/api.js';
import '../style pages/Correcoes.css';

import { adicionarHistorico } from "../correcao/historicoLocal.js";


const ROTULO_SITUACAO = {
  acerto: 'Acerto',
  erro: 'Erro',
  branco: 'Em branco',
  multipla: 'Múltipla (anulada)',
  revisar: 'Revisar',
};

// Converte a foto enviada em pixels, reduzindo se for muito grande.
async function imagemParaPixels(arquivo) {
  const url = URL.createObjectURL(arquivo);
  try {
    const img = await new Promise((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error('Não foi possível abrir a imagem.'));
      i.src = url;
    });
    const escala = Math.min(1, 1600 / img.width);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(img.width * escala);
    canvas.height = Math.round(img.height * escala);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  } finally {
    URL.revokeObjectURL(url);
  }
}

export default function Correcoes() {
  const [aba, setAba] = useState('corrigir');
  const provas = listarProvas();
  const [provaId, setProvaId] = useState(provas[0]?.provaId ?? '');
  const [versao, setVersao] = useState('A');

  const prova = provas.find((p) => p.provaId === provaId) ?? null;
  const numQuestoes = prova?.versoesProva?.[versao]?.length ?? 0;

  return (
    <div className="pagina-painel">
      <div className="no-print">
        <MenuLateral />
      </div>

      <main className="correcoes-conteudo">
        <h1 className="no-print">Correções</h1>

        {provas.length === 0 ? (
          <p className="aviso no-print">
            Nenhuma prova gerada encontrada. Gere as versões na tela de questões e volte aqui.
          </p>
        ) : (
          <>
            <div className="correcoes-controles no-print">
              <label>
                Prova
                <select value={provaId} onChange={(e) => setProvaId(e.target.value)}>
                  {provas.map((p) => (
                    <option key={p.provaId} value={p.provaId}>
                      {p.titulo}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Versão
                <select value={versao} onChange={(e) => setVersao(e.target.value)}>
                  <option value="A">A</option>
                  <option value="B">B</option>
                </select>
              </label>
            </div>

            <div className="abas no-print">
              <button
                type="button"
                className={aba === 'folha' ? 'btn-principal' : 'btn-secundario'}
                onClick={() => setAba('folha')}
              >
                Folha de respostas
              </button>
              <button
                type="button"
                className={aba === 'corrigir' ? 'btn-principal' : 'btn-secundario'}
                onClick={() => setAba('corrigir')}
              >
                Corrigir folha
              </button>
            </div>

            {aba === 'folha' && prova && (
              <FolhaPanel prova={prova} versao={versao} numQuestoes={numQuestoes} />
            )}
            {aba === 'corrigir' && prova && (
              <CorrigirPanel key={`${prova.provaId}-${versao}`} prova={prova} versao={versao} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function FolhaPanel({ prova, versao, numQuestoes }) {
  return (
    <section>
      <div className="no-print acoes">
        <p>{numQuestoes} questões · versão {versao} · até 40 questões por folha.</p>
        <button type="button" className="btn-principal" onClick={() => window.print()}>
          🖨️ Imprimir folha
        </button>
      </div>
      <div className="area-impressao">
        <FolhaResposta
          provaId={prova.provaId}
          versao={versao}
          titulo={prova.titulo}
          numQuestoes={numQuestoes}
        />
      </div>
    </section>
  );
}

function CorrigirPanel({ prova, versao }) {
  const [arquivo, setArquivo] = useState(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const [codigoLido, setCodigoLido] = useState('');
  const [lendo, setLendo] = useState(false);
  const [respostas, setRespostas] = useState(null); // array de letras | estados
  const [preenchimentos, setPreenchimentos] = useState(null);
  const [aluno, setAluno] = useState('');
  const [salvo, setSalvo] = useState(false);

  const gabarito = useMemo(() => {
    try {
      return gabaritoDaVersao(prova.versoesProva, versao);
    } catch (e) {
      return null;
    }
  }, [prova, versao]);

  const resultado = useMemo(() => {
    if (!respostas || !gabarito) return null;
    return corrigirFolha({
      leitura: respostas.map((resposta, i) => ({ numero: i + 1, resposta })),
      gabarito,
    });
  }, [respostas, gabarito]);

  async function lerFolhaEnviada() {
    if (!arquivo || !gabarito) return;
    setLendo(true);
    setErro('');
    setAviso('');
    setSalvo(false);
    try {
      const imagem = await imagemParaPixels(arquivo);

      const textoQr = lerQrCode(imagem);
      setCodigoLido(textoQr ?? '');
      const info = lerTextoQr(textoQr);
      if (!info) {
        setAviso('QR Code não encontrado. Confira a folha antes de salvar.');
      } else if (info.provaId !== prova.provaId || info.versao !== versao) {
        setAviso('O QR Code desta folha não corresponde à prova/versão selecionada.');
      }

      const leitura = lerFolha(imagem, gabarito.length);
      if (!leitura.ok) {
        setErro('Não foi possível localizar as marcas de canto. Fotografe a folha inteira, sobre fundo claro.');
        setRespostas(null);
        return;
      }
      setRespostas(leitura.questoes.map((q) => q.resposta));
      setPreenchimentos(leitura.questoes.map((q) => q.preenchimento));
    } catch (e) {
      setErro(e.message || 'Erro ao processar a imagem.');
    } finally {
      setLendo(false);
    }
  }

  function alterarResposta(i, valor) {
    setRespostas((prev) => prev.map((r, idx) => (idx === i ? valor : r)));
    setSalvo(false);
  }

  
async function salvar() {
  if (!resultado) return;

  setErro("");
  setSalvo(false);

  if (!codigoLido) {
    setErro(
      "O QR Code não foi identificado. Confira a imagem antes de salvar."
    );
    return;
  }

  const identificacao = lerTextoQr(codigoLido);

  if (
    !identificacao ||
    identificacao.provaId !== prova.provaId ||
    identificacao.versao !== versao
  ) {
    setErro(
      "O QR Code não corresponde à prova e à versão selecionadas."
    );
    return;
  }

  const dados = {
    provaId: prova.provaId,
    titulo: prova.titulo,
    versao,
    codigoFolha: codigoLido,
    aluno: aluno.trim() || null,
    respostas: [...respostas],
    ...resultado,
  };

  try {
    await enviarResultado(dados);

    adicionarHistorico(dados);

    setSalvo(true);
  } catch (e) {
    setErro(
      e.message || "Não foi possível salvar o resultado."
    );
  }
}


  if (!gabarito) {
    return <p className="aviso">Esta versão não tem gabarito válido.</p>;
  }

  return (
    <section>
      <div className="upload no-print">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            setArquivo(e.target.files?.[0] ?? null);
            setRespostas(null);
          }}
        />
        <button type="button" className="btn-principal" disabled={!arquivo || lendo} onClick={lerFolhaEnviada}>
          {lendo ? 'Lendo...' : 'Ler folha'}
        </button>
      </div>

      {erro && <p className="erro no-print">{erro}</p>}
      {aviso && <p className="aviso no-print">{aviso}</p>}

      {respostas && resultado && (
        <>
          <div className="resumo">
            <div><strong>Nota:</strong> {resultado.nota}{resultado.provisoria ? ' (provisória)' : ''}</div>
            <div>Acertos: {resultado.acertos}</div>
            <div>Erros: {resultado.erros}</div>
            <div>Em branco: {resultado.brancos}</div>
            <div>Múltiplas: {resultado.multiplas}</div>
            <div>A revisar: {resultado.duvidosas}</div>
          </div>

          <label className="aluno no-print">
            Aluno(a) (opcional)
            <input value={aluno} onChange={(e) => setAluno(e.target.value)} />
          </label>

          <table className="tabela-correcao">
            <thead>
              <tr>
                <th>Questão</th>
                <th>Marcada</th>
                <th>Gabarito</th>
                <th>Situação</th>
              </tr>
            </thead>
            <tbody>
              {resultado.detalhes.map((d, i) => (
                <tr key={d.numero} className={`linha-${d.situacao}`}>
                  <td>{d.numero}</td>
                  <td>
                    <select
                      className="no-print"
                      value={respostas[i]}
                      onChange={(e) => alterarResposta(i, e.target.value)}
                    >
                      {LETRAS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                      <option value="BRANCO">Em branco</option>
                      <option value="MULTIPLA">Múltipla</option>
                      <option value="DUVIDOSA">Revisar</option>
                    </select>
                    {preenchimentos && d.situacao === 'revisar' && (
                      <small className="dica">
                        {LETRAS.map((l) => `${l}:${Math.round(preenchimentos[i][l] * 100)}%`).join(' ')}
                      </small>
                    )}
                  </td>
                  <td>{d.correta}</td>
                  <td>{ROTULO_SITUACAO[d.situacao]}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="no-print acoes">
            <button type="button" className="btn-principal" onClick={salvar}>
              Salvar resultado
            </button>
            {salvo && <span>Resultado salvo.</span>}
          </div>
        </>
      )}
    </section>
  );
}
