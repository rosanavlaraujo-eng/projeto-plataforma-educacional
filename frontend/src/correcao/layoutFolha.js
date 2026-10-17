// Geometria da folha de respostas em milímetros (A4: 210 x 297).
// A mesma definição é usada para desenhar a folha e para ler as marcações,
// então qualquer ajuste aqui vale para os dois lados.

export const PAGINA = { largura: 210, altura: 297 };

// Marcas de registro nos cantos (centros em mm). Servem para alinhar a foto.
export const MARCAS = {
  tl: { x: 12, y: 12 },
  tr: { x: 198, y: 12 },
  bl: { x: 12, y: 285 },
  br: { x: 198, y: 285 },
  lado: 8,
};

export const LETRAS = ['A', 'B', 'C', 'D', 'E'];
export const QUESTOES_POR_COLUNA = 10;
export const COLUNAS_MAX = 4;
export const QUESTOES_MAX = QUESTOES_POR_COLUNA * COLUNAS_MAX;

const COLUNA_X = [18, 62, 106, 150];
export const INICIO_Y = 74;
const ALTURA_LINHA = 17;
const RECUO_BOLHA = 9;
const ESPACO_BOLHA = 6;
export const RAIO_BOLHA = 2.2;

// Área reservada para o QR Code (canto superior direito, abaixo da marca).
export const AREA_QR = { x: 140, y: 20, lado: 36 };

export function layoutFolha(numQuestoes) {
  if (!Number.isInteger(numQuestoes) || numQuestoes < 1 || numQuestoes > QUESTOES_MAX) {
    throw new RangeError(`A folha suporta de 1 a ${QUESTOES_MAX} questões.`);
  }

  const questoes = [];
  for (let q = 0; q < numQuestoes; q++) {
    const coluna = Math.floor(q / QUESTOES_POR_COLUNA);
    const linha = q % QUESTOES_POR_COLUNA;
    const y = INICIO_Y + linha * ALTURA_LINHA + ALTURA_LINHA / 2;
    const xColuna = COLUNA_X[coluna];

    const bolhas = LETRAS.map((letra, a) => ({
      letra,
      x: xColuna + RECUO_BOLHA + a * ESPACO_BOLHA,
      y,
    }));

    questoes.push({ numero: q + 1, x: xColuna, y, bolhas });
  }

  return { numQuestoes, questoes };
}
