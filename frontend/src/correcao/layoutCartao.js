
export const CARTAO = {
  largura: 160,
  altura: 80,
};

export const LETRAS_CARTAO = ["A", "B", "C", "D", "E"];

export const MARCAS_CARTAO = {
  tl: { x: 4, y: 4 },
  tr: { x: 156, y: 4 },
  bl: { x: 4, y: 76 },
  br: { x: 156, y: 76 },
  lado: 3,
};

export const AREA_QR_CARTAO = {
  x: 130,
  y: 12,
  lado: 22,
};

export const RAIO_BOLHA_CARTAO = 1.35;

export function layoutCartao(numQuestoes) {
  if (
    !Number.isInteger(numQuestoes) ||
    numQuestoes < 1 ||
    numQuestoes > 40
  ) {
    throw new RangeError(
      "O cartão suporta de 1 a 40 questões."
    );
  }

  const questoes = [];
  const questoesPorColuna = 10;
  const posicoesColunas = [9, 39, 69, 99];

  for (let indice = 0; indice < numQuestoes; indice++) {
    const coluna = Math.floor(indice / questoesPorColuna);
    const linha = indice % questoesPorColuna;

    const x = posicoesColunas[coluna];
    const y = 15 + linha * 5.6;

    const bolhas = LETRAS_CARTAO.map((letra, alternativa) => ({
      letra,
      x: x + 7 + alternativa * 4.2,
      y,
    }));

    questoes.push({
      numero: indice + 1,
      x,
      y,
      bolhas,
    });
  }

  return {
    numQuestoes,
    questoes,
  };
}
