
import { QRCodeSVG } from "qrcode.react";

import {
  CARTAO,
  MARCAS_CARTAO,
  AREA_QR_CARTAO,
  RAIO_BOLHA_CARTAO,
  layoutCartao,
} from "../correcao/layoutCartao.js";

import { gerarTextoQr } from "../correcao/codigoQr.js";

export default function CartaoResposta({
  provaId,
  versao,
  numQuestoes,
}) {
  const layout = layoutCartao(numQuestoes);
  const codigo = gerarTextoQr(provaId, versao);

  const marcas = [
    MARCAS_CARTAO.tl,
    MARCAS_CARTAO.tr,
    MARCAS_CARTAO.bl,
    MARCAS_CARTAO.br,
  ];

  return (
    <section
      style={{
        width: "100%",
        maxWidth: "160mm",
        margin: "12px auto 20px",
        breakInside: "avoid",
        pageBreakInside: "avoid",
        color: "#000",
        background: "#fff",
      }}
    >
      <h3
        style={{
          textAlign: "center",
          fontSize: "12px",
          fontWeight: 800,
          margin: "0 0 6px",
          color: "#000",
        }}
      >
        GABARITO OBRIGATÓRIO — VERSÃO {versao}
      </h3>

      <div
        style={{
          width: "100%",
          position: "relative",
          aspectRatio: `${CARTAO.largura} / ${CARTAO.altura}`,
          background: "#fff",
          border: "1px solid #555",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox={`0 0 ${CARTAO.largura} ${CARTAO.altura}`}
          width="100%"
          height="100%"
          style={{ display: "block" }}
          aria-label={`Cartão de respostas da versão ${versao}`}
        >
          <rect
            width={CARTAO.largura}
            height={CARTAO.altura}
            fill="#fff"
          />

          {marcas.map((marca, indice) => (
            <rect
              key={indice}
              x={marca.x - MARCAS_CARTAO.lado / 2}
              y={marca.y - MARCAS_CARTAO.lado / 2}
              width={MARCAS_CARTAO.lado}
              height={MARCAS_CARTAO.lado}
              fill="#000"
            />
          ))}

          <text
            x="9"
            y="9"
            fontSize="3"
            fontWeight="bold"
            fill="#000"
          >
            RESPOSTAS
          </text>

          {layout.questoes.map((questao) => (
            <g key={questao.numero}>
              <text
                x={questao.x}
                y={questao.y + 0.9}
                fontSize="2.6"
                fontWeight="bold"
                fill="#000"
              >
                {String(questao.numero).padStart(2, "0")}
              </text>

              {questao.bolhas.map((bolha) => (
                <g key={bolha.letra}>
                  <circle
                    cx={bolha.x}
                    cy={bolha.y}
                    r={RAIO_BOLHA_CARTAO}
                    stroke="#000"
                    strokeWidth="0.22"
                    fill="#fff"
                  />

                  <text
                    x={bolha.x}
                    y={bolha.y - 1.8}
                    fontSize="2.1"
                    textAnchor="middle"
                    fill="#000"
                  >
                    {bolha.letra}
                  </text>
                </g>
              ))}
              </g>
          ))}

          <text
            x="130"
            y="40"
            fontSize="2.5"
            fill="#000"
          >
            VERSÃO {versao}
          </text>

          <text
            x="130"
            y="46"
            fontSize="2.1"
            fill="#000"
          >
            QUESTIO
          </text>

          <text
            x="9"
            y="72"
            fontSize="2.6"
            fill="#000"
          >
            Preencha completamente apenas uma bolinha por questão.
          </text>
        </svg>

        <div
          style={{
            position: "absolute",
            left: `${(AREA_QR_CARTAO.x / CARTAO.largura) * 100}%`,
            top: `${(AREA_QR_CARTAO.y / CARTAO.altura) * 100}%`,
            width: `${(AREA_QR_CARTAO.lado / CARTAO.largura) * 100}%`,
            aspectRatio: "1",
            background: "#fff",
          }}
        >
          <QRCodeSVG
            value={codigo}
            size={120}
            level="M"
            marginSize={1}
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
