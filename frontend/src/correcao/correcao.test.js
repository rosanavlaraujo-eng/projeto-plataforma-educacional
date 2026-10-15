// Testes da lógica de correção (rodar com: node --test src/correcao/)
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { layoutFolha, MARCAS, RAIO_BOLHA, LETRAS } from './layoutFolha.js';
import { lerFolha } from './leitura.js';
import { gabaritoDaVersao, corrigirFolha } from './corrigir.js';
import { gerarTextoQr, lerTextoQr } from './codigoQr.js';

const S = 4; // pixels por mm na imagem sintética

// Monta uma folha em pixels: marcas, contorno das bolhas e preenchimentos.
// preenchimentos: { numeroQuestao: [{ letra, raio }] } (raio em mm)
function folhaSintetica(numQuestoes, preenchimentos) {
  const W = 210 * S;
  const H = 297 * S;
  const data = new Uint8ClampedArray(W * H * 4).fill(255);
  const imagem = { data, width: W, height: H };

  const pinta = (x, y, v) => {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 4;
    data[i] = data[i + 1] = data[i + 2] = v;
  };

  const disco = (cxmm, cymm, rmm, v, ring = false) => {
    const cx = cxmm * S, cy = cymm * S, r = rmm * S;
    for (let y = Math.floor(cy - r - 1); y <= cy + r + 1; y++) {
      for (let x = Math.floor(cx - r - 1); x <= cx + r + 1; x++) {
        const d = Math.hypot(x - cx, y - cy);
        if (ring ? Math.abs(d - r) < 0.6 : d <= r) pinta(x, y, v);
      }
    }
  };

  for (const k of ['tl', 'tr', 'bl', 'br']) {
    const { x, y } = MARCAS[k];
    const h = MARCAS.lado / 2;
    for (let py = (y - h) * S; py < (y + h) * S; py++)
      for (let px = (x - h) * S; px < (x + h) * S; px++) pinta(px, py, 0);
  }

  const layout = layoutFolha(numQuestoes);
  for (const q of layout.questoes) {
    for (const b of q.bolhas) {
      disco(b.x, b.y, RAIO_BOLHA, 0, true); // contorno impresso
      const marcas = (preenchimentos[q.numero] ?? []).filter((p) => p.letra === b.letra);
      for (const p of marcas) disco(b.x, b.y, p.raio, 0);
    }
  }
  return imagem;
}

test('layout: 40 questões em 4 colunas e bolhas em A-E', () => {
  const l = layoutFolha(40);
  assert.equal(l.questoes.length, 40);
  assert.equal(l.questoes[0].bolhas.map((b) => b.letra).join(''), 'ABCDE');
  assert.throws(() => layoutFolha(41));
  assert.throws(() => layoutFolha(0));
});

test('gabarito respeita o embaralhamento da versão', () => {
  const versoesProva = {
    A: [
      { alternativas: [{ texto: 'x', correta: false }, { texto: 'y', correta: true }] },
      { alternativas: [{ texto: 'z', correta: true }, { texto: 'w', correta: false }] },
    ],
  };
  assert.deepEqual(gabaritoDaVersao(versoesProva, 'A'), ['B', 'A']);
  assert.throws(() => gabaritoDaVersao(versoesProva, 'B'));
});

test('correção: acertos, erros, brancos, múltiplas e nota', () => {
  const gabarito = ['A', 'B', 'C', 'D'];
  const leitura = [
    { numero: 1, resposta: 'A' },
    { numero: 2, resposta: 'A' },
    { numero: 3, resposta: 'BRANCO' },
    { numero: 4, resposta: 'MULTIPLA' },
  ];
  const r = corrigirFolha({ leitura, gabarito, pontuacaoMaxima: 10 });
  assert.equal(r.acertos, 1);
  assert.equal(r.erros, 1);
  assert.equal(r.brancos, 1);
  assert.equal(r.multiplas, 1);
  assert.equal(r.nota, 2.5);
  assert.equal(r.provisoria, false);
});

test('correção: duvidosa deixa a nota provisória até revisão', () => {
  const gabarito = ['A', 'B'];
  const antes = corrigirFolha({
    leitura: [{ numero: 1, resposta: 'A' }, { numero: 2, resposta: 'DUVIDOSA' }],
    gabarito,
  });
  assert.equal(antes.provisoria, true);
  assert.equal(antes.duvidosas, 1);

  const depois = corrigirFolha({
    leitura: [{ numero: 1, resposta: 'A' }, { numero: 2, resposta: 'B' }],
    gabarito,
  });
  assert.equal(depois.provisoria, false);
  assert.equal(depois.nota, 10);
});

test('QR: gera e lê o texto da prova e versão', () => {
  const texto = gerarTextoQr('abc-123', 'B');
  assert.equal(texto, 'PROVA-abc-123-B');
  assert.deepEqual(lerTextoQr(texto), { provaId: 'abc-123', versao: 'B' });
  assert.equal(lerTextoQr('lixo'), null);
});

test('leitura de imagem: marcada, múltipla, branca, duvidosa e contorno ignorado', () => {
  const preenchimentos = {
    1: [{ letra: 'A', raio: 2.2 }],                              // marcada
    2: [{ letra: 'C', raio: 2.2 }, { letra: 'D', raio: 2.2 }],   // múltipla
    // 3: em branco
    4: [{ letra: 'B', raio: 0.9 }],                              // meia marcação (duvidosa)
    5: [{ letra: 'E', raio: 2.2 }],
  };
  const imagem = folhaSintetica(5, preenchimentos);
  const r = lerFolha(imagem, 5);
  assert.equal(r.ok, true);
  assert.equal(r.questoes[0].resposta, 'A');
  assert.equal(r.questoes[1].resposta, 'MULTIPLA');
  assert.equal(r.questoes[2].resposta, 'BRANCO');
  assert.equal(r.questoes[3].resposta, 'DUVIDOSA');
  assert.equal(r.questoes[4].resposta, 'E');
});

test('leitura de imagem: sem marcas de registro retorna erro', () => {
  const W = 200, H = 300;
  const imagem = { data: new Uint8ClampedArray(W * H * 4).fill(255), width: W, height: H };
  assert.equal(lerFolha(imagem, 5).ok, false);
});

test('ponta a ponta: leitura da folha e correção com gabarito', () => {
  const gabarito = ['A', 'C', 'B', 'E'];
  const preenchimentos = {
    1: [{ letra: 'A', raio: 2.2 }], // certa
    2: [{ letra: 'A', raio: 2.2 }], // errada
    3: [{ letra: 'B', raio: 2.2 }], // certa
    // 4 em branco
  };
  const imagem = folhaSintetica(4, preenchimentos);
  const { questoes } = lerFolha(imagem, 4);
  const r = corrigirFolha({ leitura: questoes, gabarito });
  assert.equal(r.acertos, 2);
  assert.equal(r.erros, 1);
  assert.equal(r.brancos, 1);
  assert.equal(r.nota, 5);
});
