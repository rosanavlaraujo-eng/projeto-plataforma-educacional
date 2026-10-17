// Leitura das marcações a partir de uma imagem (ImageData) da folha.
// Não depende de bibliotecas externas: trabalha só com os pixels.

import { MARCAS, layoutFolha } from './layoutFolha.js';

export const LIMIAR_PREENCHIDA = 0.45; // fração de pixels escuros para considerar marcada
export const LIMIAR_VAZIA = 0.15;      // abaixo disso, a bolha está vazia
const RAIO_LEITURA = 1.5;              // mm, fica dentro do contorno impresso
const JANELA = 0.12;                   // fração da imagem onde procurar cada marca
const MIN_FRACAO_MARCA = 0.03;         // fração mínima da janela que precisa ser escura

function lumAt(data, width, x, y) {
  const i = (y * width + x) * 4;
  return 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
}

// Luminância típica do papel (percentil alto), para calibrar o que é "escuro".
function luminanciaPapel(imagem) {
  const { data, width, height } = imagem;
  const total = width * height;
  const passo = Math.max(1, Math.floor(total / 20000));
  const amostras = [];
  for (let k = 0; k < total; k += passo) {
    const i = k * 4;
    amostras.push(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
  }
  amostras.sort((a, b) => a - b);
  return amostras[Math.floor((amostras.length - 1) * 0.9)];
}

// Encontra o centro de cada marca de canto pelo centroide dos pixels escuros
// dentro de uma janela no canto. Retorna null se alguma marca não aparecer.
export function localizarMarcas(imagem) {
  const { width: w, height: h, data } = imagem;
  const limiar = luminanciaPapel(imagem) * 0.5;
  const jx = Math.round(w * JANELA);
  const jy = Math.round(h * JANELA);

  const janelas = {
    tl: { x0: 0, y0: 0 },
    tr: { x0: w - jx, y0: 0 },
    bl: { x0: 0, y0: h - jy },
    br: { x0: w - jx, y0: h - jy },
  };

  const achadas = {};
  for (const [nome, { x0, y0 }] of Object.entries(janelas)) {
    let somaX = 0;
    let somaY = 0;
    let n = 0;
    for (let y = y0; y < y0 + jy; y++) {
      for (let x = x0; x < x0 + jx; x++) {
        if (lumAt(data, w, x, y) < limiar) {
          somaX += x;
          somaY += y;
          n++;
        }
      }
    }
    if (n < jx * jy * MIN_FRACAO_MARCA) return null;
    achadas[nome] = { x: somaX / n, y: somaY / n };
  }
  return achadas;
}

// Converte coordenadas da folha (mm) para pixels da imagem por interpolação
// bilinear entre as 4 marcas. Corrige deslocamento, escala e leve inclinação.
function criarMapeador(marcas) {
  const { tl, tr, bl, br } = marcas;
  const largura = MARCAS.tr.x - MARCAS.tl.x;
  const altura = MARCAS.bl.y - MARCAS.tl.y;

  return (xmm, ymm) => {
    const u = (xmm - MARCAS.tl.x) / largura;
    const v = (ymm - MARCAS.tl.y) / altura;
    return {
      x: (1 - u) * (1 - v) * tl.x + u * (1 - v) * tr.x + (1 - u) * v * bl.x + u * v * br.x,
      y: (1 - u) * (1 - v) * tl.y + u * (1 - v) * tr.y + (1 - u) * v * bl.y + u * v * br.y,
    };
  };
}

// Fração de pixels escuros dentro do círculo de leitura de uma bolha.
function escurecimento(imagem, mapear, cx, cy, limiar) {
  const { data, width, height } = imagem;
  let total = 0;
  let escuros = 0;
  for (let i = -3; i <= 3; i++) {
    for (let j = -3; j <= 3; j++) {
      const dx = i * 0.5;
      const dy = j * 0.5;
      if (dx * dx + dy * dy > RAIO_LEITURA * RAIO_LEITURA) continue;
      const p = mapear(cx + dx, cy + dy);
      const x = Math.round(p.x);
      const y = Math.round(p.y);
      if (x < 0 || y < 0 || x >= width || y >= height) continue;
      total++;
      if (lumAt(data, width, x, y) < limiar) escuros++;
    }
  }
  return total ? escuros / total : 0;
}

// Lê a folha inteira. Cada questão recebe:
//  - resposta: letra marcada | 'BRANCO' | 'MULTIPLA' | 'DUVIDOSA'
//  - preenchimento: fração escura de cada alternativa (útil para a revisão manual)
export function lerFolha(imagem, numQuestoes) {
  const marcas = localizarMarcas(imagem);
  if (!marcas) {
    return { ok: false, motivo: 'MARCAS_NAO_ENCONTRADAS', questoes: [] };
  }

  const limiar = luminanciaPapel(imagem) * 0.5;
  const mapear = criarMapeador(marcas);
  const layout = layoutFolha(numQuestoes);

  const questoes = layout.questoes.map((q) => {
    const preenchimento = {};
    for (const b of q.bolhas) {
      preenchimento[b.letra] = escurecimento(imagem, mapear, b.x, b.y, limiar);
    }

    const letras = Object.keys(preenchimento);
    const marcadas = letras.filter((l) => preenchimento[l] >= LIMIAR_PREENCHIDA);
    const duvidosas = letras.filter(
      (l) => preenchimento[l] > LIMIAR_VAZIA && preenchimento[l] < LIMIAR_PREENCHIDA
    );

    let resposta;
    if (marcadas.length > 1) resposta = 'MULTIPLA';
    else if (duvidosas.length > 0) resposta = 'DUVIDOSA';
    else if (marcadas.length === 1) resposta = marcadas[0];
    else resposta = 'BRANCO';

    return { numero: q.numero, resposta, preenchimento };
  });

  return { ok: true, questoes };
}
