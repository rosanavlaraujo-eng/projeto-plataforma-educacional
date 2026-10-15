import { useEffect, useMemo, useState } from 'react';
import QRCode from 'qrcode';
import {
  AREA_QR,
  INICIO_Y,
  MARCAS,
  PAGINA,
  QUESTOES_POR_COLUNA,
  RAIO_BOLHA,
  layoutFolha,
} from '../correcao/layoutFolha.js';
import { gerarTextoQr } from '../correcao/codigoQr.js';
import '../style components/FolhaResposta.css';

// Folha A4 em SVG, pronta para impressão. Usa a mesma geometria da leitura.
export default function FolhaResposta({ provaId, versao, titulo, numQuestoes }) {
  const layout = useMemo(() => layoutFolha(numQuestoes), [numQuestoes]);
  const codigo = gerarTextoQr(provaId, versao);
  const [qrUrl, setQrUrl] = useState(null);

  useEffect(() => {
    let ativo = true;
    QRCode.toDataURL(codigo, { margin: 1, width: 300 }).then((url) => {
      if (ativo) setQrUrl(url);
    });
    return () => {
      ativo = false;
    };
  }, [codigo]);

  const primeirasDeColuna = layout.questoes.filter((_, i) => i % QUESTOES_POR_COLUNA === 0);
  const lado = MARCAS.lado;

  return (
    <svg
      className="folha-resposta"
      viewBox={`0 0 ${PAGINA.largura} ${PAGINA.altura}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width={PAGINA.largura} height={PAGINA.altura} fill="#fff" />

      {['tl', 'tr', 'bl', 'br'].map((k) => (
        <rect
          key={k}
          x={MARCAS[k].x - lado / 2}
          y={MARCAS[k].y - lado / 2}
          width={lado}
          height={lado}
          fill="#000"
        />
      ))}

      <text x="14" y="18" className="titulo">Folha de respostas</text>
      <text x="14" y="26" className="texto">{titulo}</text>
      <text x="14" y="34" className="texto">Versão {versao}</text>

      <text x="14" y="44" className="texto">Nome:</text>
      <line x1="28" y1="44.6" x2="128" y2="44.6" className="linha" />
      <text x="14" y="52" className="texto">Turma:</text>
      <line x1="28" y1="52.6" x2="86" y2="52.6" className="linha" />
      <text x="14" y="60" className="texto">Data:</text>
      <line x1="28" y1="60.6" x2="86" y2="60.6" className="linha" />

      {qrUrl && (
        <image
          href={qrUrl}
          x={AREA_QR.x}
          y={AREA_QR.y}
          width={AREA_QR.lado}
          height={AREA_QR.lado}
        />
      )}
      <text x={AREA_QR.x} y={AREA_QR.y + AREA_QR.lado + 4} className="codigo">
        {codigo}
      </text>

      {primeirasDeColuna.map((q) =>
        q.bolhas.map((b) => (
          <text key={`cab-${q.numero}-${b.letra}`} x={b.x} y={INICIO_Y - 3} textAnchor="middle" className="letra">
            {b.letra}
          </text>
        ))
      )}

      {layout.questoes.map((q) => (
        <g key={q.numero}>
          <text x={q.x} y={q.y + 1} className="numero">{q.numero}</text>
          {q.bolhas.map((b) => (
            <circle key={b.letra} cx={b.x} cy={b.y} r={RAIO_BOLHA} className="bolha" />
          ))}
        </g>
      ))}

      <text x="20" y="280" className="instrucao">
        Preencha totalmente a bolha da alternativa escolhida, com caneta preta ou azul. Não rasure.
      </text>
    </svg>
  );
}

